import { Icon } from '../icons'
import { usePageTitle } from '../usePageTitle'
import { useSiteUi } from '../components/SiteFrame'

const steps = [
  ['چند سؤال دربارهٔ خودت', 'هدف، سلیقه و شرایطت را در پرسش‌نامه می‌گویی.'],
  ['پیشنهاد هوشمند', 'برنامهٔ اولیه با وعده‌ها بر اساس پاسخ‌های تو آماده می‌شود.'],
  ['بررسی متخصص', 'متخصص برنامه را می‌بیند، اصلاح می‌کند و تأیید می‌کند.'],
  ['همراهی در اپ', 'وعده‌ها و پیگیری روزانه؛ گفتگو با متخصص در اپ.'],
] as const

export default function AboutPage() {
  usePageTitle('دربارهٔ ما | رژیم من')
  const { toast } = useSiteUi()
  return (
    <>
      <div className="about-picture wrap">
        <img src="/assets/vegetables.jpg" alt="مواد اولیه و سبزیجات تازه برای آماده کردن غذا" />
      </div>
      <section className="section wrap about-detail">
        <header className="about-detail-head">
          <div className="eyebrow">چرا رژیم من؟</div>
          <h2>برنامه‌ای که با زندگی تو جور دربیاید</h2>
          <p className="about-detail-lead">رژیم من برای روزهای شلوغ و تصمیم‌های سختِ «امروز چی بخورم؟» ساخته شده؛ نه یک فهرست خشک، بلکه مسیر روشن از شناخت تو تا وعده‌های روزانه‌ات. در اپلیکیشن، جزئیات و مقدار هر وعده را شفاف می‌بینی و پیگیری می‌کنی. وضعیت بررسی و اصلاح برنامه توسط متخصص همیشه روشن است؛ اگر سؤالی داشته باشی یا بخواهی چیزی عوض شود، همان‌جا با متخصص گفتگو می‌کنی. مسیر روزانه و هفتگی‌ات هم در یک فضای ساده، بدون سردرگمی جلو می‌رود.</p>
        </header>
        <div className="about-steps">
          {steps.map(([title, text]) => (
            <article className="about-step" key={title}><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
        <p className="about-quote">برنامه‌ای که با <strong>زندگی روزمره‌ات</strong> جور باشد، همان برنامه‌ای است که می‌توانی به آن پایبند بمانی.</p>
      </section>
      <div className="cta wrap">
        <div>
          <h2>آماده‌ای یک قدم نزدیک‌تر شوی؟</h2>
          <p>اپلیکیشن رژیم من را نصب کن و مسیر غذایی مخصوص خودت را شروع کن.</p>
        </div>
        <button className="btn" type="button" onClick={() => toast('نسخهٔ قابل دانلود به‌زودی منتشر می‌شود.')}>
          دانلود اپلیکیشن <Icon name="arrow" />
        </button>
      </div>
    </>
  )
}
