import { Route, Routes } from 'react-router-dom'
import SiteLayout from './features/site/App'
import HomePage from './features/site/pages/HomePage'
import ArticlesPage from './features/site/pages/ArticlesPage'
import ArticlePage from './features/site/pages/ArticlePage'
import PricingPage from './features/site/pages/PricingPage'
import AboutPage from './features/site/pages/AboutPage'
import ContactPage from './features/site/pages/ContactPage'
import TermsPage from './features/site/pages/TermsPage'
import RefundPage from './features/site/pages/RefundPage'
import OnboardingNoticePage from './features/site/pages/OnboardingNoticePage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="index.html" element={<HomePage />} />
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
        <Route path="onboarding" element={<OnboardingNoticePage />} />
        <Route path="onboarding.html" element={<OnboardingNoticePage />} />
      </Route>
    </Routes>
  )
}