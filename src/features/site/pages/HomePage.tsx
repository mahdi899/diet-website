import { Link } from 'react-router-dom'
import { Icon } from '../icons'
import { ArticleCard, useMagazine } from '../magazine'
import { useHorizontalSlider } from '../useHorizontalSlider'
import { usePageTitle } from '../usePageTitle'
import { useSiteUi } from '../components/SiteFrame'

const reviews = [
  { name: 'سارا م.', text: 'برنامه روشن بود؛ دیگر وسط هفته حدس نمی‌زنم چه بخورم. وقتی سؤال داشتم، جواب متخصص سریع رسید.' },
  { name: 'امیر ح.', text: 'غذاهای آشنا توی برنامه بود و اجراش راحت‌تر از چیزی بود که فکر می‌کردم. پیگیری روزانه انگیزه می‌دهد.' },
  { name: 'نرگس ک.', text: 'برای روزهای شلوغ، وعده‌های ساده و قابل‌اجرا پیشنهاد شد. حس می‌کنم برنامه واقعاً برای زندگی خودم نوشته شده.' },
  { name: 'رضا ج.', text: 'بعد از بررسی متخصص، چند مورد اصلاح شد و دقیقاً همان چیزی شد که می‌خواستم. گفتگو داخل اپ راحت است.' },
  { name: 'مریم ع.', text: 'پرسش‌نامه کوتاه بود ولی کامل؛ از همان هفتهٔ اول فهمیدم چقدر و چه چیزی بخورم.' },
  { name: 'پریسا ل.', text: 'قدم‌های کوچک هفتگی را دوست دارم. فشار «همه‌چیز یا هیچ» ندارم و مسیر قابل ادامه است.' },
]

const steps = [
  ['۰۱ / شناخت تو', 'چند سؤال ساده', 'هدفت، سلیقه‌ات و شرایطت را بگو.'],
  ['۰۲ / پیشنهاد هوشمند', 'برنامهٔ اولیهٔ تو', 'پیشنهادی بر اساس اطلاعاتی که وارد کردی.'],
  ['۰۳ / نگاه متخصص', 'بررسی و تأیید', 'متخصص برنامه را بررسی و اصلاح می‌کند.'],
  ['۰۴ / شروع همراهی', 'یک هفته در کنار تو', 'وعده‌هایت را ببین و مسیرت را پیگیری کن.'],
] as const

const benefits = [
  ['۰۱', 'bowl', 'غذای آشنا، برنامهٔ شخصی', 'علایق، هدف و شرایط خودت را در پرسش‌نامه مشخص کن؛ نقطهٔ شروع برنامه، شناخت توست.'],
  ['۰۲', 'tomato', 'یک متخصص در کنار تو', 'برنامه پیش از رسیدن به دست تو بررسی می‌شود. اگر سؤالی داری یا تغییری می‌خواهی، گفتگو کن.'],
  ['۰۳', 'carrot', 'قدم‌های کوچک و دیدنی', 'وعده‌های انجام‌شده، روند وزن و مسیر هفتگی‌ات را در یک فضای ساده و روشن دنبال کن.'],
] as const

const plans = [
  ['شروع · ۱۵ روزه', '۱٬۲۹۰٬۰۰۰ تومان'],
  ['همراه · ۳۰ روزه', '۱٬۹۹۰٬۰۰۰ تومان'],
  ['VIP · ۹۰ روزه', '۸٬۹۹۰٬۰۰۰ تومان'],
] as const

function DownloadButton({ children }: { children: string }) {
  const { toast } = useSiteUi()
  return (
    <button className="btn" type="button" onClick={() => toast('نسخهٔ قابل دانلود به‌زودی منتشر می‌شود.')}>
      {children} <Icon name="arrow" />
    </button>
  )
}

export default function HomePage() {
  usePageTitle('غذای خوب، زندگی سبز | رژیم من')
  const magazine = useMagazine()
  const reviewsRef = useHorizontalSlider('.testimonial-card', 5000)
  const { openStart } = useSiteUi()

  return (
    <>
      <section className="hero wrap">
        <div>
          <div className="eyebrow">یک مسیر تازه برای مراقبت از خودت</div>
          <h1>رژیم هوشمند،<br /><em>مسیر کوتاه‌تر.</em></h1>
          <p className="lead">برنامهٔ غذایی تو باید شبیه زندگی خودت باشد.<br />در رژیم من، هوش مصنوعی پیشنهاد می‌دهد و متخصص بررسی می‌کند؛ تا با خیال راحت‌تر، قدم بعدی را برداری.</p>
          <div className="actions"><DownloadButton>دانلود اپلیکیشن رژیم من</DownloadButton></div>
        </div>
        <div className="hero-media">
          <img src="/assets/salad.jpg" alt="بشقاب سالاد تازه با سبزیجات رنگارنگ" />
          <span className="veg"><Icon name="carrot" /></span>
          <div className="floating">
            <span className="iconbox"><Icon name="check" /></span>
            <div><strong>هوشمند، با همراهی متخصص</strong><small>از شناخت تو تا برنامهٔ غذایی تو</small></div>
          </div>
        </div>
      </section>
      <section className="process" id="how">
        <div className="wrap">
          {steps.map(([num, title, text]) => (
            <article key={num}><span className="num">{num}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>
      <section className="section wrap">
        <div className="benefits">
          {benefits.map(([index, icon, title, text]) => (
            <article className="benefit" key={title}>
              <span className="index">{index}</span>
              <Icon name={icon} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap">
        <div className="showcase">
          <div>
            <div className="eyebrow">رژیم من، در دسترس تو</div>
            <h2>برنامه‌ات را ببین.<br />مسیرت را زندگی کن.</h2>
            <p>هر روز بدان چه غذایی، با چه مقداری در برنامه‌ات داری. تغییر لازم بود؟ از همان‌جا با متخصصت در میان بگذار.</p>
            <ul className="list-check">
              {['جزئیات و مقدار هر وعده', 'پیگیری وضعیت بررسی و اصلاح برنامه', 'گفتگو با متخصص و ثبت بازخورد'].map((item) => (
                <li key={item}><Icon name="check" /> {item}</li>
              ))}
            </ul>
            <button className="btn" type="button" onClick={openStart}>آشنایی با اپلیکیشن <Icon name="arrow" /></button>
          </div>
          <div>
            <div className="phone" aria-label="نمای تصویری نمونه از اپلیکیشن">
              <div className="phone-head"><b>سلام، روزت سبز 🌿</b><span>۹:۴۱</span></div>
              <div className="phone-card"><p>کالری امروز تو</p><strong>۱٬۲۴۰</strong><p>نمونهٔ نمایشی داشبورد</p></div>
              <h4 style={{ margin: '20px 0 0' }}>برنامهٔ امروز</h4>
              <div className="phone-meal"><img src="/assets/breakfast.jpg" alt="صبحانه" /><div><b>یک صبحانهٔ تازه</b><br /><small>جزئیات و مقدار وعده</small></div></div>
              <div className="phone-meal"><img src="/assets/salad.jpg" alt="وعده سالاد" /><div><b>ناهار رنگارنگ</b><br /><small>جزئیات و مقدار وعده</small></div></div>
              <div className="phone-meal"><span className="iconbox"><Icon name="chat" /></span><b>گفتگو با متخصص</b></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap" id="pricing" aria-labelledby="home-pricing-title">
        <div className="section-title">
          <h2 id="home-pricing-title">خدمات و تعرفه‌ها</h2>
          <Link className="textlink" to="/pricing">جزئیات پلن‌ها</Link>
        </div>
        <div className="benefits">
          {plans.map(([name, price]) => (
            <article className="benefit" key={name}><h3>{name}</h3><p><strong>{price}</strong> برای هر دوره</p></article>
          ))}
        </div>
        <p>
          <Link className="textlink" to="/terms">شرایط و ضوابط خرید</Link>
          {' · '}
          <Link className="textlink" to="/refund">لغو و بازگشت وجه</Link>
          {' · '}
          <Link className="textlink" to="/contact">تماس با ما</Link>
        </p>
      </section>
      <section className="section wrap testimonials">
        <div className="testimonials-intro center">
          <div className="eyebrow">صدای کاربران</div>
          <h2>نظرات کاربران</h2>
        </div>
        <div className="blog-slider testimonials-slider" ref={reviewsRef} role="region" aria-label="اسلایدر نظرات کاربران">
          {reviews.map((review) => (
            <article className="testimonial-card" key={review.name}>
              <div className="testimonial-stars" aria-label="امتیاز پنج از پنج"><span /><span /><span /><span /><span /></div>
              <blockquote><p>{review.text}</p></blockquote>
              <footer className="testimonial-author"><strong>{review.name}</strong></footer>
            </article>
          ))}
        </div>
      </section>
      <section className="section wrap">
        <div className="section-title">
          <div>
            <div className="eyebrow">مجلهٔ رژیم من</div>
            <h2>کمی بخوان، آگاهانه‌تر انتخاب کن.</h2>
          </div>
          <Link className="textlink" to="/articles">همهٔ مقاله‌ها <Icon name="arrow" /></Link>
        </div>
        <div className="magazine-grid" id="home-posts">
          {magazine.isError ? <p>دریافت مقالات ممکن نشد.</p> : null}
          {magazine.data?.map((item) => <ArticleCard key={item.id} item={item} />)}
        </div>
      </section>
      <div className="cta wrap">
        <div>
          <h2>از یک انتخاب خوب شروع کن.</h2>
          <p>یک برنامهٔ غذایی، متناسب با سلیقه و زندگی تو.</p>
        </div>
        <DownloadButton>دانلود اپلیکیشن</DownloadButton>
      </div>
    </>
  )
}
