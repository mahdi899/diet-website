import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

const plans = [
  {
    days: '۱۵ روزه',
    name: 'شروع',
    lead: 'یک شروع مشخص، متناسب با تو',
    price: '۱٬۲۹۰٬۰۰۰',
    featured: false,
    points: ['برنامهٔ تغذیه اختصاصی با همراهی متخصص منتخب', 'جایگزین‌های غذایی متناسب با سلیقه‌ات', 'لیست خرید برنامه'],
  },
  {
    days: '۳۰ روزه',
    name: 'همراه',
    lead: 'زمان بیشتر، همراهی نزدیک‌تر',
    price: '۱٬۹۹۰٬۰۰۰',
    featured: true,
    points: ['همهٔ امکانات پلن شروع در یک دورهٔ ۳۰ روزه', '۲ نوبت بازبینی و اصلاح برنامه', 'پیگیری هفتگی روند و اجرای برنامه', 'پشتیبانی متنی در طول دوره'],
  },
  {
    days: '۹۰ روزه',
    name: 'VIP',
    lead: 'همراهی خصوصی و پیوسته',
    price: '۸٬۹۹۰٬۰۰۰',
    featured: false,
    points: ['برنامهٔ اختصاصی و همراهی متخصص منتخب', 'جایگزین‌های غذایی و لیست خرید برنامه', '۶ نوبت بازبینی و اصلاح برنامه', '۳ جلسهٔ آنلاین با متخصص منتخب', 'پیگیری هفتگی و پشتیبانی اولویت‌دار', 'برنامهٔ حفظ عادت‌ها در پایان دوره'],
  },
]

export default function PricingPage() {
  usePageTitle('خدمات و تعرفه‌ها | رژیم من')
  return (
    <>
      <section className="subhero wrap center pricing-intro">
        <div className="eyebrow">همراهی متناسب با مسیر تو</div>
        <h1>خدمات و تعرفه‌ها</h1>
        <p>از یک برنامهٔ غذایی اختصاصی تا همراهی و بازبینی در طول دوره؛<br />جزئیات هر پلن را ببین و با آگاهی انتخاب کن.</p>
        <p className="pricing-caption">تمام مبالغ به تومان و برای یک دوره از پلن انتخابی هستند.</p>
      </section>
      <section className="wrap pricing-grid" aria-label="مقایسه پلن‌ها و قیمت‌ها">
        {plans.map((plan) => (
          <article className={plan.featured ? 'price-card price-card-featured' : 'price-card'} key={plan.name}>
            <div className="price-card-top"><span className="price-duration">{plan.days}</span><h2>{plan.name}</h2><p>{plan.lead}</p></div>
            <p className="price-amount"><strong>{plan.price}</strong><span>تومان / هر دوره</span></p>
            <h3>خدمات این پلن</h3>
            <ul>{plan.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <Link className="btn" to="/onboarding">شروع پرسش‌نامه</Link>
          </article>
        ))}
      </section>
      <section className="wrap pricing-status" aria-labelledby="delivery-title">
        <h2 id="delivery-title">تحویل برنامه و پشتیبانی</h2>
        <p>پس از فعال‌شدن خرید آنلاین، برنامهٔ غذایی به‌صورت دیجیتال در محیط آنلاین رژیم من، بلافاصله پس از پرداخت موفق تحویل داده می‌شود. در صورت نارضایتی امکان درخواست بازگشت وجه وجود دارد.</p>
        <p>پشتیبانی: <a href="tel:+989056013977" dir="ltr">۰۹۰۵۶۰۱۳۹۷۷</a>؛ شنبه تا پنجشنبه، ساعت ۸ صبح تا ۸ شب به وقت ایران. <Link to="/terms">شرایط خرید</Link> و <Link to="/refund">روش درخواست بازگشت وجه</Link> را پیش از انتخاب مطالعه کنید.</p>
      </section>
      <aside className="wrap pricing-status" aria-labelledby="payment-status">
        <h2 id="payment-status">وضعیت ثبت سفارش و پرداخت</h2>
        <p>در حال حاضر پرداخت آنلاین فعال نیست. در این صفحه مبلغی دریافت نمی‌شود؛ دکمهٔ «شروع پرسش‌نامه» شما را به فرم دمو می‌برد و به معنی خرید یا ثبت سفارش قطعی نیست.</p>
      </aside>
      <div className="wrap" style={{ marginTop: 24 }}>
        <p>پرسشی دربارهٔ پلن‌ها داری؟ <Link to="/contact" style={{ textDecoration: 'underline' }}>تماس با پشتیبانی رژیم من</Link> · <a href="tel:+989056013977" dir="ltr">۰۹۰۵۶۰۱۳۹۷۷</a></p>
      </div>
      <section className="section wrap pricing-details" aria-labelledby="service-details">
        <div>
          <div className="eyebrow">پیش از انتخاب بدان</div>
          <h2 id="service-details">هر پلن چه همراهی‌ای دارد؟</h2>
          <p>تفاوت پلن‌ها در مدت دوره، تعداد بازبینی‌ها و میزان همراهی است. جزئیات خدمات و مبلغ هر دوره در کارت همان پلن آمده است.</p>
        </div>
        <div className="pricing-questions">
          <details open>
            <summary>برای مشاهدهٔ قیمت‌ها باید ثبت‌نام کنم؟</summary>
            <p>خیر. همهٔ تعرفه‌ها و جزئیات خدمات در همین صفحه، بدون ورود یا تکمیل پرسش‌نامه قابل مشاهده‌اند.</p>
          </details>
          <details>
            <summary>بازبینی برنامه یعنی چه؟</summary>
            <p>بازبینی، بررسی روند اجرای برنامه و اصلاح آن متناسب با بازخورد شماست. پلن همراه ۲ نوبت و پلن VIP شش نوبت بازبینی دارد.</p>
          </details>
          <details>
            <summary>آیا این مبالغ اشتراک ماهانهٔ خودکار هستند؟</summary>
            <p>خیر. مبلغ درج‌شده مربوط به یک دوره با مدت مشخص است؛ پلن شروع ۱۵ روز، همراه ۳۰ روز و VIP نود روز است.</p>
          </details>
          <details>
            <summary>چطور مسیر انتخاب برنامه را شروع کنم؟</summary>
            <p>با ورود به <Link to="/onboarding">پرسش‌نامهٔ آنبوردینگ</Link> می‌توانی هدف و اطلاعات اولیه‌ات را وارد کنی. این مرحله به‌تنهایی خرید محسوب نمی‌شود.</p>
          </details>
        </div>
      </section>
    </>
  )
}
