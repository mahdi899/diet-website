import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

export default function ContactPage() {
  usePageTitle('تماس و پشتیبانی | رژیم من')
  return (
    <>
      <section className="subhero wrap center info-intro">
        <div className="eyebrow">با ما در ارتباط باش</div>
        <h1>تماس و پشتیبانی</h1>
        <p>برای پرسش دربارهٔ پلن‌ها، جزئیات خدمات و پیگیری درخواستت با پشتیبانی رژیم من تماس بگیر.</p>
      </section>
      <div className="wrap info-content">
        <section className="info-card" aria-labelledby="support-phone">
          <h2 id="support-phone">شمارهٔ پشتیبانی</h2>
          <a className="contact-number" href="tel:+989056013977" dir="ltr" aria-label="تماس با شماره پشتیبانی ۰۹۰۵۶۰۱۳۹۷۷">۰۹۰۵۶۰۱۳۹۷۷</a>
          <p><strong>ساعات پاسخ‌گویی:</strong> شنبه تا پنجشنبه، ساعت ۸ صبح تا ۸ شب به وقت ایران.</p>
          <p>برای پیگیری سریع‌تر، موضوع درخواست و نام پلن موردنظرت را هنگام تماس اعلام کن.</p>
        </section>
        <section className="info-card">
          <h2>اطلاعات پیش از انتخاب</h2>
          <p>قیمت و جزئیات هر پلن را می‌توانی بدون ثبت‌نام ببینی. برای جزئیات هر پلن، صفحهٔ خدمات و تعرفه‌ها را ببین.</p>
          <div className="info-links">
            <Link to="/pricing">خدمات و تعرفه‌ها</Link>
            <Link to="/terms">شرایط خرید</Link>
            <Link to="/refund">لغو و بازگشت وجه</Link>
          </div>
        </section>
      </div>
    </>
  )
}
