# Apricity | Gamify Garden

یک وب‌اپ کوچک و فارسی برای فاطمه (Apricity)؛ باغی آرام برای تبدیل کارهای روزانه به قدم‌های قابل‌انجام.

نسخه‌ی آنلاین: [soheil-aghayani.github.io/Gamify-Garden](https://soheil-aghayani.github.io/Gamify-Garden/)

درون برنامه می‌شود راهنمای کوتاه را دید، انرژی روز را انتخاب کرد، تسک‌های تازه ساخت یا حذف کرد و پیشرفت را فقط در همان مرورگر نگه داشت. فونت اصلی رابط `Vazirmatn` است و همه‌چیز برای موبایل و راست‌به‌چپ طراحی شده.

## اجرا

```bash
npm install
npm run dev
```

برای بررسی build:

```bash
npm run build
npm test
```

## انتشار

Workflow موجود در `.github/workflows/deploy.yml` با هر push به شاخه `main` پروژه را می‌سازد و روی GitHub Pages منتشر می‌کند. در تنظیمات ریپو، بخش Pages را روی گزینه **GitHub Actions** قرار بده.

این نسخه اطلاعات را فقط در مرورگر ذخیره می‌کند و هیچ حساب کاربری یا سرور اختصاصی ندارد.
