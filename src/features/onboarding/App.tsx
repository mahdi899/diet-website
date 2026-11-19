import { Route, Routes } from 'react-router-dom'
import { WizardPage } from './presentation/wizard/WizardPage'

export default function App() {
  return (
    <Routes>
      <Route index element={<WizardPage />} />
      <Route path="quiz" element={<WizardPage />} />
      <Route path="goals" element={<WizardPage />} />
      <Route path="payment" element={<WizardPage />} />
    </Routes>
  )
}
