import 'dotenv/config';
import {request as httpRequest} from 'node:http';
import {request as httpsRequest} from 'node:https';
import express, {type Request, type Response} from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {GoogleGenAI, Type, type Content, type Part} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MODELS = new Set(['gemini-4-hydrogen', 'gemini-3.1-flash-lite']);

const ROLE_INSTRUCTIONS: Record<string, string> = {
  nutritionist: [
    'تو «مشاور هوشمند تغذیه رژیم من» هستی.',
    'به زبان فارسی طبیعی، محترمانه، علمی و صمیمی پاسخ بده.',
    'پیشنهادهای غذایی خودت را متناسب با سفره و ذائقهٔ ایرانی (مثل خوراک‌ها، سالادها، صبحانه‌های ساده و پروتئین‌های در دسترس) بده.',
    'حجم پاسخ‌ها متعادل، کاربردی و قابل اجرا باشد. در موارد پزشکی خاص (بیماری‌های زمینه‌ای، بارداری یا مصرف دارو) یادآوری کن که برنامهٔ نهایی در رژیم من توسط متخصص تغذیه بررسی و تأیید می‌شود.',
  ].join(' '),
  quick_calorie: [
    'تو «دستیار سریع کالری و جایگزین‌های غذایی رژیم من» هستی.',
    'پاسخ‌هایت را کوتاه، دقیق و دسته‌بندی‌شده به فارسی بنویس.',
    'برای هر خوراکی، کالری تقریبی به ازای هر واحد یا ۱۰۰ گرم، درشت‌مغذی‌های اصلی (پروتئین، کربوهیدرات، چربی) و ۲ تا ۳ جایگزین سالم ایرانی پیشنهاد بده.',
  ].join(' '),
  habit_coach: [
    'تو «مربی عادت‌های سبز و سبک زندگی رژیم من» هستی.',
    'با لحنی آرام، انگیزه‌بخش و بدون سرزنش به کاربر کمک کن هوس‌های غذایی، پرخوری عصبی، مصرف آب، خواب و نظم وعده‌ها را مدیریت کند.',
    'راهکارهای کوچک، عملی و قدم‌به‌قدم برای زندگی روزمره پیشنهاد بده.',
  ].join(' '),
};

interface IncomingMessage {
  role: 'user' | 'model';
  text: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function toParts(msg: IncomingMessage): Part[] {
  const parts: Part[] = [];
  if (msg.image?.data && msg.image?.mimeType) {
    parts.push({
      inlineData: {
        data: msg.image.data,
        mimeType: msg.image.mimeType,
      },
    });
  }
  if (msg.text.trim()) {
    parts.push({text: msg.text.trim()});
  }
  return parts;
}

function formatGeminiError(error: unknown): string {
  const errMessage = error instanceof Error ? error.message : 'خطا در ارتباط با سرویس هوش مصنوعی.';
  if (errMessage === 'MISSING_API_KEY') {
    return 'کلید GEMINI_API_KEY در تنظیمات سرور یافت نشد. لطفاً در بخش Settings > Secrets کلید را بررسی کنید.';
  }
  if (errMessage.includes('403') || errMessage.includes('PERMISSION_DENIED') || errMessage.includes('API_KEY_INVALID')) {
    return 'کلید API معتبر نیست یا دسترسی ندارد. لطفاً کلید را در Settings > Secrets بررسی کنید.';
  }
  if (errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED')) {
    return 'سقف درخواست موقتی پر شده است. لطفاً کمی بعد دوباره تلاش کنید.';
  }
  return 'در دریافت پاسخ از سرویس هوش مصنوعی خطایی رخ داد. لطفاً دوباره تلاش کنید.';
}

async function startServer() {
  const app = express();
  // Forward the wizard's API to the same Laravel backend as My-Diet.
  app.use('/v1', (req: Request, res: Response) => {
    const target = new URL(req.originalUrl, process.env.SABZINE_API_TARGET || 'http://127.0.0.1:8000');
    const request = target.protocol === 'https:' ? httpsRequest : httpRequest;
    const upstream = request(target, {method: req.method, headers: {...req.headers, host: target.host}}, (response) => {
      res.writeHead(response.statusCode || 502, response.headers);
      response.pipe(res);
    });
    upstream.on('error', () => {
      if (!res.headersSent) res.status(502).json({messageFa: 'ارتباط با سرور برقرار نیست.'});
      else res.destroy();
    });
    req.pipe(upstream);
  });
  app.use(express.json({limit: '12mb'}));

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = req.body as {
      messages?: IncomingMessage[];
      model?: string;
      roleId?: string;
    };

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (messages.length === 0) {
      res.status(400).json({error: 'پیامی برای ارسال وجود ندارد.'});
      return;
    }

    const requestedModel = typeof body.model === 'string' ? body.model : 'gemini-4-hydrogen';
    const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : 'gemini-4-hydrogen';
    const roleId = typeof body.roleId === 'string' && body.roleId in ROLE_INSTRUCTIONS ? body.roleId : 'nutritionist';
    const systemInstruction = ROLE_INSTRUCTIONS[roleId];

    const latest = messages[messages.length - 1];
    if (!latest || latest.role !== 'user') {
      res.status(400).json({error: 'آخرین پیام باید از طرف کاربر باشد.'});
      return;
    }

    const latestParts = toParts(latest);
    if (latestParts.length === 0) {
      res.status(400).json({error: 'متن یا تصویر پیام نمی‌تواند خالی باشد.'});
      return;
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch (err) {
      res.status(503).json({error: formatGeminiError(err)});
      return;
    }

    const history: Content[] = messages
      .slice(0, -1)
      .map((item) => ({
        role: item.role,
        parts: toParts(item),
      }))
      .filter((item) => item.parts.length > 0);

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (payload: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    try {
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction,
        },
        history,
      });

      const stream = await chat.sendMessageStream({
        message: latestParts,
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          sendEvent({text});
        }
      }

      sendEvent({done: true});
      res.end();
    } catch (error) {
      sendEvent({error: formatGeminiError(error)});
      res.end();
    }
  });

  app.post('/api/meal-plan-preview', async (req: Request, res: Response) => {
    const {
      goal = 'کاهش وزن اصولی',
      gender = 'خانم',
      age = 30,
      height = 168,
      weight = 74,
      targetWeight = 65,
      activity = 'متوسط',
      style = 'سفره ایرانی متعادل',
      challenge = 'ریزه‌خواری عصر و شب',
      targetCalories = 1650,
    } = (req.body ?? {}) as Record<string, unknown>;

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch (err) {
      res.status(503).json({error: formatGeminiError(err)});
      return;
    }

    const prompt = [
      'یک نمونه برنامه غذایی ۱ روزه ایرانی دقیق، خوش‌خوراک و واقع‌بینانه برای کاربر زیر در «رژیم من» طراحی کن:',
      `هدف: ${String(goal)} | جنسیت: ${String(gender)} | سن: ${Number(age)} سال | قد: ${Number(height)} سانتی‌متر | وزن فعلی: ${Number(weight)} کیلوگرم | وزن هدف: ${Number(targetWeight)} کیلوگرم`,
      `سطح فعالیت: ${String(activity)} | سبک غذایی مورد علاقه: ${String(style)} | چالش اصلی: ${String(challenge)} | کالری هدف روزانه: حدود ${Number(targetCalories)} کیلوکالری.`,
      'شامل ۴ وعده (صبحانه، ناهار، میان‌وعده عصر، شام) با مقادیر دقیق به قاشق/کف دست/گرم، کالری هر وعده، یک جایگزین ساده ایرانی برای هر وعده، یک یادداشت صمیمی از طرف متخصص تغذیه، و ۵ قلم کلیدی لیست خرید روزانه باشد.',
    ].join('\n');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'تو طراح برنامه غذایی ایرانی در سامانه «رژیم من» هستی. فقط خروجی JSON معتبر مطابق اسکیما تولید کن.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              specialistNote: {
                type: Type.STRING,
                description: 'توصیه اختصاصی و صمیمی متخصص درباره چالش و هدف کاربر',
              },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: {type: Type.STRING, description: 'نام وعده مثل صبحانه یا ناهار'},
                    time: {type: Type.STRING, description: 'ساعت پیشنهادی مثل ۰۸:۰۰'},
                    title: {type: Type.STRING, description: 'نام غذای اصلی ایرانی'},
                    amount: {type: Type.STRING, description: 'مقدار دقیق به گرم، قاشق یا کف دست'},
                    calories: {type: Type.NUMBER, description: 'کالری تقریبی وعده'},
                    protein: {type: Type.NUMBER, description: 'پروتئین به گرم'},
                    swap: {type: Type.STRING, description: 'پیشنهاد جایگزین هم‌کالری'},
                  },
                  required: ['label', 'time', 'title', 'amount', 'calories', 'protein', 'swap'],
                },
              },
              shoppingList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: {type: Type.STRING},
                    amount: {type: Type.STRING},
                    category: {type: Type.STRING},
                  },
                  required: ['item', 'amount', 'category'],
                },
              },
            },
            required: ['specialistNote', 'meals', 'shoppingList'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error) {
      res.status(500).json({error: formatGeminiError(error)});
    }
  });

  app.post('/api/article-summary', async (req: Request, res: Response) => {
    const {title = '', content = ''} = (req.body ?? {}) as {title?: string; content?: string};
    if (!title || !content) {
      res.status(400).json({error: 'عنوان و متن مقاله الزامی است.'});
      return;
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch (err) {
      res.status(503).json({error: formatGeminiError(err)});
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `مقاله زیر از مجله «رژیم من» را در ۳ نکته کلیدی و کاربردی خلاصه کن و ۱ تمرین کوچک برای امروز پیشنهاد بده:\nعنوان: ${title}\nمتن:\n${content.slice(0, 5000)}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bullets: {
                type: Type.ARRAY,
                items: {type: Type.STRING},
                description: '۳ نکته کلیدی و کوتاه از مقاله',
              },
              actionStep: {
                type: Type.STRING,
                description: 'یک قدم کوچک و عملی برای اجرای امروز',
              },
            },
            required: ['bullets', 'actionStep'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error) {
      res.status(500).json({error: formatGeminiError(error)});
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images'), {
      maxAge: '30d',
      immutable: true,
    }));
    app.use('/assets', express.static(path.resolve(__dirname, 'public/assets'), {
      maxAge: '30d',
      immutable: true,
    }));
    app.use('/brand', express.static(path.resolve(__dirname, 'public/brand'), {
      maxAge: '30d',
      immutable: true,
    }));

    app.get('/@vite/client', (_req, res) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.send([
        'const sheetsMap = new Map();',
        'export function updateStyle(id, content) {',
        '  let style = sheetsMap.get(id);',
        '  if (!style) {',
        '    style = document.createElement("style");',
        '    style.type = "text/css";',
        '    style.setAttribute("data-vite-dev-id", id);',
        '    style.textContent = content;',
        '    document.head.appendChild(style);',
        '    sheetsMap.set(id, style);',
        '  } else if (style.textContent !== content) {',
        '    style.textContent = content;',
        '  }',
        '}',
        'export function removeStyle(id) {',
        '  const style = sheetsMap.get(id);',
        '  if (style) { style.remove(); sheetsMap.delete(id); }',
        '}',
        'export function createHotContext() {',
        '  return { accept() {}, dispose() {}, prune() {}, invalidate() {}, decline() {}, on() {}, off() {}, send() {} };',
        '}',
        'export function injectQuery(url) { return url; }',
        'export class ErrorOverlay extends HTMLElement {}',
      ].join('\n'));
    });

    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use('/assets', express.static(path.join(distDir, 'assets'), {
      maxAge: '365d',
      immutable: true,
    }));
    app.use('/src/assets', express.static(path.join(distDir, 'src/assets'), {
      maxAge: '30d',
      immutable: true,
    }));
    app.use(express.static(distDir, {maxAge: '1d'}));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
