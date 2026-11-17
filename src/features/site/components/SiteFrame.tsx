import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../icons'
import { BrandLogo } from '@shared/ui/BrandLogo'
import '../styles/site.css'

type PageKey = 'home' | 'pricing' | 'about' | 'articles' | 'article' | 'contact' | 'terms' | 'refund'

const links: Array<{ to: string; label: string; key: PageKey }> = [
  { to: '/', label: 'خانه', key: 'home' },
  { to: '/pricing', label: 'خدمات و تعرفه‌ها', key: 'pricing' },
  { to: '/about', label: 'دربارهٔ ما', key: 'about' },
  { to: '/articles', label: 'مقالات', key: 'articles' },
  { to: '/contact', label: 'تماس با ما', key: 'contact' },
]

interface SiteUiValue {
  openStart: () => void
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
  if (path.startsWith('/article')) return path.startsWith('/articles') ? 'articles' : 'article'
  if (path.startsWith('/pricing')) return 'pricing'
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
  const page = pageKey(location.pathname)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 3200)
    return () => window.clearTimeout(timer)
  }, [message])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollPaddingTop
    root.style.scrollPaddingTop = '105px'
    return () => {
      root.style.scrollPaddingTop = previous
    }
  }, [])

  const openStart = () => dialogRef.current?.showModal()
  const closeStart = () => dialogRef.current?.close()
  const toast = (text: string) => setMessage(text)
  const onDownload = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    toast('نسخهٔ قابل دانلود به‌زودی منتشر می‌شود.')
  }

  return (
    <SiteUiContext.Provider value={{ openStart, toast }}>
      <div className="site-shell" data-page={page}>
        <header className="header">
          <nav className="nav wrap" aria-label="منوی اصلی">
            <Link className="brand" to="/" aria-label="رژیم من، صفحهٔ اصلی"><BrandLogo size={48} /></Link>
            <div className={open ? 'navlinks open' : 'navlinks'} id="navlinks">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={isCurrent(location.pathname, link.key) ? 'active' : undefined}
                  aria-current={isCurrent(location.pathname, link.key) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button className="btn" type="button" onClick={onDownload}>
              دانلود اپلیکیشن <Icon name="arrow" />
            </button>
            <button
              className="menu"
              type="button"
              aria-label="باز کردن منو"
              aria-expanded={open}
              aria-controls="navlinks"
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name="menu" />
            </button>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <div className="footer-grid">
              <div className="footer-brand">
                <Link className="brand" to="/" aria-label="رژیم من، صفحهٔ اصلی"><BrandLogo size={48} tone="white" /></Link>
                <p>غذای خوب، متناسب با زندگی تو.<br />ترکیب هوش مصنوعی و نگاه متخصص، برای یک مسیر شخصی‌تر در تغذیه.</p>
              </div>
              <div className="footer-links-block">
                <div className="footer-nav">
                  <h3>دسترسی سریع</h3>
                  <Link to="/">خانه</Link>
                  <Link to="/pricing">خدمات و تعرفه‌ها</Link>
                  <Link to="/about">دربارهٔ ما</Link>
                  <Link to="/articles">مقالات</Link>
                  <Link to="/contact">تماس و پشتیبانی</Link>
                  <Link to="/terms">شرایط خرید</Link>
                  <Link to="/refund">لغو و بازگشت وجه</Link>
                  <a href="#download" onClick={onDownload}>دانلود اپلیکیشن</a>
                </div>
                <div className="footer-trust" aria-label="نمادهای اعتماد">
                  <a className="trust-badge trust-badge--1" href="https://ecunion.ir" target="_blank" rel="noopener noreferrer" title="اتحادیه کسب‌وکارهای مجازی" />
                  <a className="trust-badge trust-badge--2" href="https://nec.ir" target="_blank" rel="noopener noreferrer" title="نظام صنفی رایانه‌ای کشور" />
                  <a className="trust-badge" referrerPolicy="origin" target="_blank" rel="noopener noreferrer" href="https://trustseal.enamad.ir/?id=8548363&Code=ZYiwbYxH0J4xKTd1Bk19P4I9o8sD2WUa">
                    <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=8548363&Code=ZYiwbYxH0J4xKTd1Bk19P4I9o8sD2WUa" alt="نماد اعتماد الکترونیکی" style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }} />
                  </a>
                  <a className="trust-badge trust-badge--4" href="https://samandehi.ir" target="_blank" rel="noopener noreferrer" title="ساماندهی" />
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <span>طراحی شده با عشق توسط آکادمی رستمی ❤️</span>
              <span>با فکرِ حال بهتر تو <Icon name="leaf" /></span>
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
          <div className="iconbox"><Icon name="phone" /></div>
          <h2 style={{ marginTop: 18 }}>شروع یک مسیر سبز</h2>
          <p>در اپلیکیشن رژیم من می‌توانی اطلاعاتت را تکمیل کنی، برنامه بگیری و با متخصص گفتگو کنی.</p>
          <p className="sample-label">این سایت فعلاً نسخهٔ طراحی رابط است؛ دریافت اپلیکیشن و ثبت درخواست پس از آماده شدن سرویس فعال می‌شود.</p>
          <button className="btn light" type="button" onClick={closeStart}>متوجه شدم</button>
        </dialog>
        <div className="toast" role="status" hidden={!message}>{message}</div>
      </div>
    </SiteUiContext.Provider>
  )
}
