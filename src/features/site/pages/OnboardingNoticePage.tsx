import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icon } from '../icons'
import { usePageTitle } from '../usePageTitle'

const MotionLink = motion.create(Link)

const onboardingUrl = import.meta.env.VITE_ONBOARDING_URL as string | undefined

export default function OnboardingNoticePage() {
  usePageTitle('شروع آنبوردینگ | رژیم من')
  return (
    <section className="mx-auto max-w-[1220px] px-4 py-12 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-white p-6 sm:p-12 text-center shadow-xs">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-pine">
          <Icon name="target100" />
        </div>
        <div className="eyebrow justify-center">محل اتصال به سامانهٔ آنبوردینگ</div>
        <h1 className="mt-2 mb-3 text-2xl sm:text-3xl font-extrabold text-ink">
          پرسش‌نامهٔ اختصاصی رژیم من
        </h1>
        <p className="mx-auto mb-6 max-w-md text-sm leading-7 text-muted">
          این بخش برای اتصال به ماژول آنبوردینگ اختصاصی شما آماده شده است.
        </p>

        {onboardingUrl ? (
          <div className="mb-6">
            <motion.a
              className="btn whitespace-nowrap"
              href={onboardingUrl}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
            >
              ورود به پرسش‌نامه <Icon name="arrow" />
            </motion.a>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-dashed border-line-strong bg-soft p-5 text-xs leading-6 text-muted">
            جایگاه اتصال آنبوردینگ (<code dir="ltr" className="font-mono text-pine">VITE_ONBOARDING_URL</code>)
          </div>
        )}

        <MotionLink
          className="textlink justify-center"
          to="/"
          whileHover={{ scale: 1.03, x: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 420, damping: 20 }}
        >
          بازگشت به صفحهٔ اصلی <Icon name="arrow" />
        </MotionLink>
      </div>
    </section>
  )
}