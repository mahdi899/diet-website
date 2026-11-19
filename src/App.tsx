import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import SiteLayout from './features/site/App'
import HomePage from './features/site/pages/HomePage'

const BmiPage = lazy(() => import('./features/site/pages/BmiPage'))
const ArticlesPage = lazy(() => import('./features/site/pages/ArticlesPage'))
const ArticlePage = lazy(() => import('./features/site/pages/ArticlePage'))
const PricingPage = lazy(() => import('./features/site/pages/PricingPage'))
const AboutPage = lazy(() => import('./features/site/pages/AboutPage'))
const ContactPage = lazy(() => import('./features/site/pages/ContactPage'))
const TermsPage = lazy(() => import('./features/site/pages/TermsPage'))
const RefundPage = lazy(() => import('./features/site/pages/RefundPage'))
const OnboardingApp = lazy(() => import('./features/onboarding/App'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="onboarding/*" element={<Suspense fallback={<div className="min-h-screen" />}><OnboardingApp /></Suspense>} />
        <Route path="onboarding.html" element={<Navigate to="/onboarding" replace />} />
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="index.html" element={<HomePage />} />
          <Route path="bmi" element={<BmiPage />} />
          <Route path="bmi.html" element={<BmiPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles.html" element={<ArticlesPage />} />
          <Route path="article" element={<ArticlePage />} />
          <Route path="article.html" element={<ArticlePage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="pricing.html" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="about.html" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="contact.html" element={<ContactPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="terms.html" element={<TermsPage />} />
          <Route path="refund" element={<RefundPage />} />
          <Route path="refund.html" element={<RefundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}