import {useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent} from 'react';
import {MessageCircle, Send, Sparkles, Trash2, X, ImagePlus, Zap, Brain} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';

type ChatModel = 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite';
type RoleId = 'nutritionist' | 'quick_calorie' | 'habit_coach';

interface ChatImage {
  data: string;
  mimeType: string;
  previewUrl: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: ChatImage;
}

const ROLES: Array<{
  id: RoleId;
  label: string;
  description: string;
  defaultModel: ChatModel;
  prompts: string[];
}> = [
  {
    id: 'nutritionist',
    label: 'مشاور تغذیه',
    description: 'پیشنهاد وعده‌های سالم ایرانی و راهنمای برنامه غذایی',
    defaultModel: 'gemini-4-hydrogen',
    prompts: [
      'یک شام ایرانی سبک، کم‌کالری و سیرکننده پیشنهاد بده.',
      'برای کسی که ظهر سر کار است چه ناهاری مناسب‌تر است؟',
      'چطور پروتئین روزانه‌ام را بدون مکمل بالا ببرم؟',
    ],
  },
  {
    id: 'quick_calorie',
    label: 'کالری و جایگزین سریع',
    description: 'محاسبه سریع کالری و معرفی جایگزین‌های سالم',
    defaultModel: 'gemini-3.1-flash-lite',
    prompts: [
      'کالری یک پرس برنج و خورشت قرمه‌سبزی چقدر است؟',
      'جایگزین سالم برای نون سنگک و پنیر در صبحانه چیست؟',
      'به جای شیرینی و بیسکویت عصرانه چه میان‌وعده‌ای بخورم؟',
    ],
  },
  {
    id: 'habit_coach',
    label: 'مربی عادت‌های سبز',
    description: 'مدیریت هوس غذایی، آب، خواب و تداوم مسیر',
    defaultModel: 'gemini-4-hydrogen',
    prompts: [
      'شب‌ها موقع فیلم دیدن هوس تنقلات می‌کنم؛ چکار کنم؟',
      'یک روتین ساده برای نوشیدن آب کافی در روز بده.',
      'اگر یک روز پرخوری کردم چطور بدون عذاب وجدان ادامه بدهم؟',
    ],
  },
];

const STORAGE_KEY = 'mydiet_gemini_chat_v1';

interface NutritionChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queuedPrompt?: string;
  onQueuedPromptConsumed?: () => void;
}

export function NutritionChatbot({
  open,
  onOpenChange,
  queuedPrompt,
  onQueuedPromptConsumed,
}: NutritionChatbotProps) {
  const [roleId, setRoleId] = useState<RoleId>('nutritionist');
  const [model, setModel] = useState<ChatModel>('gemini-4-hydrogen');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState<ChatImage | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');

  const threadRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRole = ROLES.find((r) => r.id === roleId) ?? ROLES[0]!;

  useEffect(() => {
    try {
      const serializable = messages.map((m) => ({
        ...m,
        image: m.image ? {mimeType: m.image.mimeType, data: m.image.data, previewUrl: m.image.previewUrl} : undefined,
      }));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const el = threadRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, open, streaming]);

  useEffect(() => {
    if (open && queuedPrompt && !streaming) {
      setInput(queuedPrompt);
      onQueuedPromptConsumed?.();
    }
  }, [open, queuedPrompt, streaming, onQueuedPromptConsumed]);

  const handleRoleSwitch = (nextRole: RoleId) => {
    setRoleId(nextRole);
    const meta = ROLES.find((r) => r.id === nextRole);
    if (meta) {
      setModel(meta.defaultModel);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError('حجم تصویر نباید بیشتر از ۶ مگابایت باشد.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.split(',')[1] ?? '';
      if (base64) {
        setPendingImage({
          data: base64,
          mimeType: file.type,
          previewUrl: result,
        });
        setError('');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if ((!text && !pendingImage) || streaming) return;

    setError('');
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: text || 'لطفاً این تصویر غذایی را بررسی و تحلیل کن.',
      image: pendingImage ?? undefined,
    };

    const assistantId = `${Date.now()}-model`;
    const nextHistory = [...messages, userMessage];

    setMessages([...nextHistory, {id: assistantId, role: 'model', text: ''}]);
    if (!overrideText) setInput('');
    setPendingImage(null);
    setStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          model,
          roleId,
          messages: nextHistory.map((m) => ({
            role: m.role,
            text: m.text,
            image: m.image ? {data: m.image.data, mimeType: m.image.mimeType} : undefined,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        const fallback = await response.json().catch(() => ({error: 'خطا در برقراری ارتباط با سرور.'}));
        throw new Error(fallback.error || 'خطا در دریافت پاسخ.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {stream: true});
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const line = event
            .split('\n')
            .find((l) => l.startsWith('data: '));
          if (!line) continue;
          const jsonText = line.slice(6).trim();
          if (!jsonText) continue;

          const parsed = JSON.parse(jsonText) as {text?: string; error?: string; done?: boolean};
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? {...m, text: m.text + parsed.text} : m)),
            );
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطای غیرمنتظره در گفتگو.';
      setError(message);
      setMessages((prev) => prev.filter((m) => !(m.id === assistantId && !m.text)));
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const clearHistory = () => {
    if (streaming) return;
    setMessages([]);
    setError('');
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{opacity: 0, scale: 0.9, y: 12}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.9, y: 12}}
            transition={{duration: 0.2}}
            type="button"
            onClick={() => onOpenChange(true)}
            aria-label="باز کردن دستیار هوشمند تغذیه"
            className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 hidden md:flex items-center gap-2.5 rounded-2xl bg-pine px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-pine/25 transition hover:-translate-y-0.5 hover:bg-green-hover whitespace-nowrap"
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span>دستیار هوشمند تغذیه</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{opacity: 0, y: 20, scale: 0.97}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 20, scale: 0.97}}
            transition={{duration: 0.22}}
            aria-label="دستیار هوشمند رژیم من"
            className="fixed bottom-4 left-4 right-4 z-50 flex max-h-[82vh] flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-2xl sm:right-auto sm:left-6 sm:bottom-6 sm:w-[430px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-forest px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-mint">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="m-0 text-sm font-bold text-white">دستیار هوشمند رژیم من</h2>
                  <p className="m-0 text-xs text-mint/90">{activeRole.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    disabled={streaming}
                    title="پاک کردن گفتگو"
                    aria-label="پاک کردن گفتگو"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-mint/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="بستن گفتگو"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-mint/80 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Role & Model selector */}
            <div className="border-b border-line bg-soft/70 px-4 py-3">
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="انتخاب نقش دستیار">
                {ROLES.map((r) => {
                  const selected = r.id === roleId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => handleRoleSwitch(r.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                        selected
                          ? 'bg-pine text-white shadow-xs'
                          : 'bg-white text-ink/80 hover:bg-sage'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-muted">
                <span>حالت پاسخ‌گویی:</span>
                <div className="flex items-center gap-1 rounded-xl bg-white p-1 border border-line">
                  <button
                    type="button"
                    onClick={() => setModel('gemini-4-hydrogen')}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition whitespace-nowrap ${
                      model === 'gemini-4-hydrogen'
                        ? 'bg-sage font-bold text-pine'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Brain className="h-3.5 w-3.5" />
                    <span>جامع</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModel('gemini-3.1-flash-lite')}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition whitespace-nowrap ${
                      model === 'gemini-3.1-flash-lite'
                        ? 'bg-sage font-bold text-pine'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>سریع</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable thread */}
            <div
              ref={threadRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 min-h-[260px] max-h-[46vh]"
            >
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-line bg-white p-4 text-xs leading-6 text-ink">
                    سلام! من دستیار هوشمند <strong>رژیم من</strong> هستم. می‌توانی دربارهٔ انتخاب وعده، کالری غذاها، جایگزین‌های سالم یا حتی تصویر بشقاب غذایت از من بپرسی.
                  </div>
                  <div className="space-y-2">
                    <p className="m-0 text-[11px] font-bold text-muted">پیشنهاد برای شروع گفتگو:</p>
                    {activeRole.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-right text-xs text-ink transition hover:border-pine/40 hover:bg-sage/60"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-6 whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-pine text-white rounded-br-sm'
                          : 'border border-line bg-white text-ink rounded-bl-sm shadow-xs'
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image.previewUrl}
                          alt="تصویر ضمیمه‌شده"
                          className="mb-2 max-h-40 w-full rounded-xl object-cover"
                        />
                      )}
                      {msg.text || (streaming ? 'در حال نوشتن پاسخ...' : '')}
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && (
              <div className="mx-4 mb-2 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2 text-xs text-danger">
                {error}
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-line bg-white p-3">
              {pendingImage && (
                <div className="mb-2 flex items-center justify-between rounded-xl border border-line bg-soft px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={pendingImage.previewUrl}
                      alt="پیش‌نمایش"
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                    <span className="text-[11px] text-ink">تصویر آماده ارسال است</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingImage(null)}
                    className="rounded-lg p-1 text-muted hover:text-danger"
                    aria-label="حذف تصویر"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={streaming}
                  title="افزودن عکس غذا برای بررسی"
                  aria-label="افزودن عکس غذا"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-soft text-pine transition hover:bg-sage disabled:opacity-40"
                >
                  <ImagePlus className="h-4 w-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="سؤالت را دربارهٔ تغذیه یا وعده‌هایت بنویس..."
                  className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-line bg-cream px-3 py-2 text-base sm:text-xs text-ink placeholder:text-muted focus:border-pine focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={streaming || (!input.trim() && !pendingImage)}
                  aria-label="ارسال پیام"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine text-white transition hover:bg-green-hover disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
