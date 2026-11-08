# گراتولز

دایرکتوری ابزارهای رایگان وب. سایت استاتیک است (HTML + JSON) و روی GitHub Pages اجرا می‌شود.

## راه‌اندازی بعد از ساخت مخزن
1. همهٔ فایل‌ها را روی شاخهٔ `main` آپلود کن (فایل‌های با نقطه مثل `.pages.yml` و `.nojekyll` را هم).
2. **Settings ← Pages ← Source: Deploy from a branch ← main / (root)**.
3. در [Formspree](https://formspree.io) یک فرم بساز، آدرسش (`https://formspree.io/f/xxxxxxxx`) را در `index.html` به‌جای `YOUR_FORM_ID` در ثابت `FORM_URL` بگذار.

## افزودن ابزار
- از [Pages CMS](https://pagescms.org) (فایل `.pages.yml` آماده است)، یا
- مستقیم در `data/sites.json`.

پیشنهادهای بازدیدکننده‌ها از فرم سایت به ایمیل تو (از طریق Formspree) می‌رسد و بعد از بررسی دستی اضافه می‌شود.

فیلدها: `name`، `url`، `description`، `category` (`graphic` | `dev` | `converter` | `productivity`)، `popular` و `icon` (اختیاری، مثل `assets/tools/haikei.png`).

## فونت و آیکون
فونت استعداد از jsDelivr و آیکون‌ها از Tabler (داخل `index.html`) هستند. آیکون ابزارها به‌صورت پیش‌فرض از favicon گوگل می‌آید؛ اگر آیکونی نبود حرف اول نام نمایش داده می‌شود.
