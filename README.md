# diet-website

سایت عمومی **رژیم من** (خانه، تعرفه‌ها، مقالات، تماس، …) — استخراج‌شده از مخزن اصلی [My-Diet](https://github.com/mahdi899/My-Diet) برای کار روی UI بدون کل مونوریپو.

## اجرای محلی

```bash
npm install
npm run dev
```

مرورگر: `http://127.0.0.1:3001`

## مقالات و API

- پیش‌فرض: محتوا از `public/magazine.json` (بدون بک‌اند).
- اگر Laravel روشن باشد، `vite` مسیر `/v1` را به `http://127.0.0.1:8000` پروکسی می‌کند (`SABZINE_API_TARGET`).

## ساخت

```bash
npm run build
npm run preview
```

## همگام‌سازی با مونوریپو

منبع حقیقت صفحات سایت:

`My-Diet/frontend/src/features/site/`

پس از تغییر در این مخزن، در صورت نیاز همان فایل‌ها را به مسیر بالا در My-Diet کپی کنید (یا برعکس).

## Google AI Studio

این پروژه فقط شامل سایت است: React 18، Vite 6، React Router، TanStack Query. وابستگی‌های پنل ادمین/دکتر و آنبوردینگ نیست.