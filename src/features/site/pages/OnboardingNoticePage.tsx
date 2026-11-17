import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

const onboardingUrl = import.meta.env.VITE_ONBOARDING_URL as string | undefined

export default function OnboardingNoticePage() {
  usePageTitle('پرسش‌نامه | رژیم من')
  return (
    <section className="subhero wrap center info-intro">
      <div className="eyebrow">آغاز مسیر</div>
      <h1>پرسش‌نامهٔ آنبوردینگ</h1>
      <p>این مخزن فقط سایت عمومی رژیم من است. فرم پرسش‌نامه در اپ و سامانهٔ اصلی اجرا می‌شود.</p>
      {onboardingUrl ? (
        <p>
          <a className="btn" href={onboardingUrl}>
            ادامه در محیط پرسش‌نامه
          </a>
        </p>
      ) : (
        <p>
          برای اتصال، متغیر <code dir="ltr">VITE_ONBOARDING_URL</code> را در <code dir="ltr">.env</code> تنظیم کنید
          (مثلاً آدرس آنبوردینگ روی دامنهٔ production).
        </p>
      )}
      <p>
        <Link className="textlink" to="/pricing">
          بازگشت به تعرفه‌ها
        </Link>
      </p>
    </section>
  )
}