import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Icon, type IconName } from '../icons'
import { LottieLineIcon } from '../lottieData'
import { BrandLogo } from '@shared/ui/BrandLogo'
import { NutritionChatbot } from './NutritionChatbot'
import '../styles/site.css'

const MotionLink = motion.create(Link)

type PageKey = 'home' | 'bmi' | 'pricing' | 'about' | 'articles' | 'article' | 'contact' | 'terms' | 'refund' | 'onboarding'

const links: Array<{
  to: string
  label: string
  shortLabel: string
  tag: string
  key: PageKey
  icon: IconName
}> = [
  { to: '/', label: 'خانه', shortLabel: 'خانه', tag: 'صفحهٔ اصلی', key: 'home', icon: 'leaf' },
  { to: '/bmi', label: 'محاسبه BMI', shortLabel: 'BMI', tag: 'آنالیز هوشمند', key: 'bmi', icon: 'scale' },
  { to: '/pricing', label: 'تعرفه‌ها', shortLabel: 'تعرفه‌ها', tag: 'پلن‌های رژیم', key: 'pricing', icon: 'target100' },
  { to: '/about', label: 'دربارهٔ ما', shortLabel: 'متد ما', tag: 'تیم متخصصان', key: 'about', icon: 'specialist' },
  { to: '/articles', label: 'مقالات', shortLabel: 'مجله', tag: 'نکات تغذیه', key: 'articles', icon: 'bowl' },
  { to: '/contact', label: 'تماس', shortLabel: 'تماس', tag: 'پشتیبانی ۲۴/۷', key: 'contact', icon: 'coach24' },
]

interface SiteUiValue {
  openStart: () => void
  openChat: (initialPrompt?: string) => void
  toast: (message: string) => void
}

const SiteUiContext = createContext<SiteUiValue | null>(null)

export function useSiteUi() {
  const value = useContext(SiteUiContext)
  if (!value) throw new Error('useSiteUi must be used inside the public site')
  return value
}

function pageKey(pathname: string): PageKey {
  const path = pathname.replace(/\.html$/, '') || '/'
  if (path.startsWith('/bmi')) return 'bmi'
  if (path.startsWith('/article')) return path.startsWith('/articles') ? 'articles' : 'article'
  if (path.startsWith('/pricing')) return 'pricing'
  if (path.startsWith('/onboarding')) return 'onboarding'
  if (path.startsWith('/about')) return 'about'
  if (path.startsWith('/contact')) return 'contact'
  if (path.startsWith('/terms')) return 'terms'
  if (path.startsWith('/refund')) return 'refund'
  return 'home'
}

function isCurrent(pathname: string, key: PageKey) {
  const current = pageKey(pathname)
  if (key === 'articles') return current === 'articles' || current === 'article'
  return current === key
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const page = pageKey(location.pathname)
  const [open, setOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [queuedPrompt, setQueuedPrompt] = useState<string | undefined>(undefined)
  const [message, setMessage] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousPathRef = useRef(location.pathname)

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return
    previousPathRef.current = location.pathname
    setOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 3400)
    return () => window.clearTimeout(timer)
  }, [message])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollPaddingTop
    root.style.scrollPaddingTop = '96px'
    return () => {
      root.style.scrollPaddingTop = previous
    }
  }, [])

  const openStart = useCallback(() => dialogRef.current?.showModal(), [])
  const closeStart = useCallback(() => dialogRef.current?.close(), [])
  const openChat = useCallback((promptText?: string) => {
    if (promptText && typeof promptText === 'string') {
      setQueuedPrompt(promptText)
    }
    setChatOpen(true)
  }, [])
  const toast = useCallback((text: string) => setMessage(text), [])
  const handleQueuedPromptConsumed = useCallback(() => setQueuedPrompt(undefined), [])

  const siteUiValue = useMemo(
    () => ({ openStart, openChat, toast }),
    [openStart, openChat, toast],
  )

  return (
    <SiteUiContext.Provider value={siteUiValue}>
      <div className="site-shell min-h-screen max-w-full overflow-x-clip flex flex-col bg-white pb-20 md:pb-0" data-page={page} dir="rtl">
        {/* 2026 Floating Dynamic Island / Glass Capsule Header */}
        <header className="sticky top-0 z-40 px-3 pt-2 pb-1 sm:px-8 sm:pt-3.5 md:px-12">
          <div className="mx-auto max-w-[1220px]">
            <div className="relative flex h-14 sm:h-18 items-center justify-between gap-2 rounded-full border border-[#143326]/10 bg-white/90 px-3.5 sm:px-6 shadow-[0_12px_34px_rgba(20,51,38,0.07)] backdrop-blur-2xl">
              {/* Zone 1: Brand */}
              <Link
                className="flex items-center gap-2 shrink-0 whitespace-nowrap"
                to="/"
                aria-label="رژیم من"
              >
                <BrandLogo size={38} />
              </Link>

              {/* Zone 2: Minimal Sliding Pill Nav (Desktop) */}
              <nav
                aria-label="منوی اصلی"
                className="hidden md:flex items-center gap-1 rounded-full border border-[#143326]/8 bg-[#F7F5F0] p-1"
              >
                {links.map((link) => {
                  const active = isCurrent(location.pathname, link.key)
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-colors ${
                        active ? 'text-[#143326]' : 'text-[#5c6b63] hover:text-[#14261d]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="desktop-nav-pill"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="absolute inset-0 rounded-full bg-white shadow-2xs"
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Zone 3: Primary CTA */}
              <div className="flex items-center gap-2">
                <MotionLink
                  to="/onboarding"
                  whileHover={{ scale: 1.04, y: -1.5 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                  className="group inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#143326] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_10px_24px_rgba(20,51,38,0.18)] transition-colors hover:bg-[#1F5E43]"
                >
                  <span>دریافت رژیم</span>
                  <Icon name="arrow" className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </MotionLink>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main" className="flex-1 min-w-0 max-w-full overflow-x-clip">{children}</main>

        {/* 2026 Floating Bottom Glass Dock + Bento Menu Sheet on Mobile */}
        <nav
          aria-label="ناوبری سریع موبایل"
          className="fixed bottom-2 inset-x-3 z-40 md:hidden"
        >
          <div className="mx-auto max-w-md relative">
            {/* Floating Bento Popover Sheet anchored above Bottom Nav */}
            <AnimatePresence>
              {open && (
                <>
                  <motion.div
                    key="mobile-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-30 bg-[#14261d]/25 backdrop-blur-xs md:hidden"
                  />
                  <motion.div
                    key="mobile-bento-sheet"
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    className="relative z-40 mb-2.5 overflow-hidden rounded-[2rem] border border-[#143326]/12 bg-white/96 p-3.5 shadow-[0_24px_60px_rgba(20,51,38,0.22)] backdrop-blur-2xl"
                  >
                    {/* 2x3 Visual Bento Grid Navigation (All Pages) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {links.map((link) => {
                        const active = isCurrent(location.pathname, link.key)
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                              active
                                ? 'border-[#143326] bg-[#F3F7F4] shadow-2xs'
                                : 'border-[#143326]/8 bg-[#F7F5F0]/75 hover:bg-[#F7F5F0]'
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                active
                                  ? 'bg-[#143326] text-white'
                                  : 'bg-white text-[#143326] shadow-2xs'
                              }`}
                            >
                              <Icon name={link.icon} className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-[#14261d] truncate">
                                {link.label}
                              </div>
                              <div className="text-[10px] font-bold text-[#5c6b63] truncate">
                                {link.tag}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Quick Bottom Action Strip inside Bento Menu */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FAF5F2] border border-[#EED8CE] px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <LottieLineIcon variant="coach" className="h-5 w-5" />
                        <span className="text-xs font-extrabold text-[#14261d]">
                          پشتیبانی ۲۴ ساعته
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false)
                            openChat()
                          }}
                          className="min-h-[44px] rounded-full bg-[#C86446] px-3.5 py-2 text-[11px] font-bold text-white cursor-pointer"
                        >
                          شروع چت
                        </button>
                        <Link
                          to="/onboarding"
                          onClick={() => setOpen(false)}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#143326] px-3.5 py-2 text-[11px] font-bold text-white"
                        >
                          دریافت رژیم
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Bottom Dock Pill */}
            <div className="relative z-40 flex items-center justify-around rounded-full border border-[#143326]/12 bg-white/94 p-1.5 shadow-[0_16px_40px_rgba(20,51,38,0.16)] backdrop-blur-2xl">
              {links.slice(0, 4).map((item) => {
                const active = !open && isCurrent(location.pathname, item.key)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex flex-1 min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full py-1 text-center transition-colors ${
                      active ? 'text-white' : 'text-[#5c6b63] hover:text-[#14261d]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="mobile-bottom-dock"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-[#143326] shadow-xs"
                      />
                    )}
                    <Icon name={item.icon} className="relative z-10 h-4 w-4" />
                    <span className="relative z-10 text-[10px] font-extrabold leading-tight">
                      {item.shortLabel}
                    </span>
                  </Link>
                )
              })}

              {/* 5th Slot (replaces المجله): Bento Pages Menu Toggle */}
              {(() => {
                const isMorePage = page === 'articles' || page === 'article' || page === 'contact' || page === 'terms' || page === 'refund'
                const menuActive = open || isMorePage
                return (
                  <button
                    type="button"
                    aria-label={open ? 'بستن منوی صفحات' : 'باز کردن منوی صفحات'}
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                    className={`relative flex flex-1 min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full py-1 text-center transition-colors cursor-pointer ${
                      menuActive ? 'text-white' : 'text-[#5c6b63] hover:text-[#14261d]'
                    }`}
                  >
                    {menuActive && (
                      <motion.span
                        layoutId="mobile-bottom-dock"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-[#143326] shadow-xs"
                      />
                    )}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.85}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="relative z-10 h-4 w-4"
                    >
                      {open ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                      ) : (
                        <>
                          <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
                          <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
                          <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
                          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
                        </>
                      )}
                    </svg>
                    <span className="relative z-10 text-[10px] font-extrabold leading-tight">
                      {open ? 'بستن' : 'صفحات'}
                    </span>
                  </button>
                )
              })()}
            </div>
          </div>
        </nav>

        {/* Minimalist Modern Footer */}
        <footer className="bg-white pt-3 pb-6 sm:pt-6 sm:pb-10">
          <div className="mx-auto max-w-[1220px] px-4 sm:px-8 md:px-12">
            <div className="rounded-[1.75rem] sm:rounded-[2.2rem] border border-[#143326]/8 bg-[#F7F5F0] p-5 sm:p-10">
              <div className="flex flex-col justify-between gap-5 sm:gap-8 lg:flex-row lg:items-center">
                {/* Brand & Short Tagline */}
                <div className="space-y-2.5 sm:space-y-3">
                  <Link className="inline-flex items-center" to="/" aria-label="رژیم من">
                    <BrandLogo size={38} />
                  </Link>
                  <p className="text-xs sm:text-sm font-bold text-[#4a6356]">
                    متخصص تغذیه + کوچ ۲۴ ساعته · تضمین ۱۰۰٪ هدف
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 sm:gap-x-5 sm:gap-y-2 pt-0.5 text-xs font-extrabold text-[#11261b]">
                    <Link to="/" className="hover:text-[#1a7f37]">خانه</Link>
                    <Link to="/bmi" className="hover:text-[#1a7f37]">محاسبه BMI</Link>
                    <Link to="/pricing" className="hover:text-[#1a7f37]">تعرفه‌ها</Link>
                    <Link to="/about" className="hover:text-[#1a7f37]">دربارهٔ ما</Link>
                    <Link to="/articles" className="hover:text-[#1a7f37]">مقالات</Link>
                    <Link to="/contact" className="hover:text-[#1a7f37]">تماس</Link>
                    <Link to="/terms" className="hover:text-[#1a7f37]">شرایط خرید</Link>
                    <Link to="/refund" className="hover:text-[#1a7f37]">بازگشت وجه</Link>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-2 sm:gap-2.5 self-start lg:self-center" aria-label="نمادهای اعتماد">
                  <a
                    className="trust-badge trust-badge--1 !w-12 !h-12 sm:!w-14 sm:!h-14 rounded-2xl border border-[#11261b]/10 bg-white shadow-2xs"
                    href="https://ecunion.ir"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="اتحادیه کسب‌وکارهای مجازی"
                  />
                  <a
                    className="trust-badge trust-badge--2 !w-12 !h-12 sm:!w-14 sm:!h-14 rounded-2xl border border-[#11261b]/10 bg-white shadow-2xs"
                    href="https://nec.ir"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="نظام صنفی رایانه‌ای کشور"
                  />
                  <a
                    className="trust-badge !w-12 !h-12 sm:!w-14 sm:!h-14 rounded-2xl border border-[#11261b]/10 bg-white p-1.5 shadow-2xs"
                    referrerPolicy="origin"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://trustseal.enamad.ir/?id=8548363&Code=ZYiwbYxH0J4xKTd1Bk19P4I9o8sD2WUa"
                  >
                    <img
                      referrerPolicy="origin"
                      src="https://trustseal.enamad.ir/logo.aspx?id=8548363&Code=ZYiwbYxH0J4xKTd1Bk19P4I9o8sD2WUa"
                      alt="اینماد"
                      className="h-full w-full object-contain"
                    />
                  </a>
                  <a
                    className="trust-badge trust-badge--4 !w-12 !h-12 sm:!w-14 sm:!h-14 rounded-2xl border border-[#11261b]/10 bg-white shadow-2xs"
                    href="https://samandehi.ir"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="ساماندهی"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-7 flex flex-row items-center justify-between gap-2 border-t border-[#11261b]/8 pt-3.5 sm:pt-5 text-[10px] sm:text-[11px] font-bold text-[#4a6356]">
                <span>طراحی شده توسط آکادمی رستمی</span>
                <span className="inline-flex items-center gap-1.5 text-[#1a7f37]">
                  <span>تناسب اندام هوشمند</span>
                  <Icon name="leaf" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              </div>
            </div>
          </div>
        </footer>

        <dialog
          className="dialog"
          id="start-dialog"
          ref={dialogRef}
          onClick={(event) => {
            const dialog = dialogRef.current
            if (!dialog || event.target !== dialog) return
            const box = dialog.getBoundingClientRect()
            if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeStart()
          }}
        >
          <button className="close" type="button" aria-label="بستن" onClick={closeStart}>×</button>
          <div className="iconbox"><Icon name="coach24" /></div>
          <h2 style={{ marginTop: 18 }}>دریافت رژیم اختصاصی</h2>
          <p>با متخصص تغذیه و کوچ ۲۴ ساعته.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <motion.button
              className="btn"
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
              onClick={() => {
                closeStart()
                navigate('/onboarding')
              }}
            >
              دریافت رژیم
            </motion.button>
            <button className="btn light" type="button" onClick={closeStart}>بستن</button>
          </div>
        </dialog>

        <div className="toast" role="status" hidden={!message}>{message}</div>
        <NutritionChatbot
          open={chatOpen}
          onOpenChange={setChatOpen}
          queuedPrompt={queuedPrompt}
          onQueuedPromptConsumed={handleQueuedPromptConsumed}
        />
      </div>
    </SiteUiContext.Provider>
  )
}
