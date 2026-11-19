import { useCallback, useEffect, useRef, useState } from 'react'
import { BrandLogo } from '@shared/ui/BrandLogo'
import { useLocation, useNavigate } from 'react-router-dom'
import { historyAction, pathFor, stepOf } from '../../domain/progress'
import { faDigits, isAnswered, answerOf } from '../../domain/questionnaire'
import { audience, loadQuestionnaireCatalog, onboarding, questionnaireGoals, readProgress, writeProgress } from '../../composition'
import { useWizard } from '../../application/wizard-store'
import { CheckoutStage } from './stages/CheckoutStage'
import { GoalsStage } from './stages/GoalsStage'
import { IntroStage } from './stages/IntroStage'
import { PlansStage } from './stages/PlansStage'
import { PreparingStage } from './stages/PreparingStage'
import { QuizStage } from './stages/QuizStage'
import { SpecialistsStage } from './stages/SpecialistsStage'
import { VerifyStage } from './stages/VerifyStage'
import '../../styles/onboarding.css'

export function WizardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const wizard = useWizard()
  const [ready, setReady] = useState(questionnaireGoals().length > 0)
  const [error, setError] = useState('')
  const questionnaireCompleted = useRef(false)
  const booted = useRef(false)
  const applyingHistory = useRef(false)
  const showPreparing = useCallback(() => {
    if (useWizard.getState().stage === 'preparing') useWizard.getState().setStage('specialists')
  }, [])

  useEffect(() => { onboarding.installTracking() }, [])

  useEffect(() => {
    if (wizard.stage === 'preparing') {
      if (!questionnaireCompleted.current) {
        questionnaireCompleted.current = true
        audience.complete()
      }
      audience.step('preparing')
      return
    }
    if (wizard.stage === 'quiz' && wizard.goal) {
      const question = wizard.questions[wizard.index]
      audience.step('question', { goal: wizard.goal.id, question: question?.originalNumber ?? wizard.index + 1 })
      return
    }
    const named = wizard.stage === 'goals' ? 'goals'
      : wizard.stage === 'specialists' ? 'specialists'
        : wizard.stage === 'plans' ? 'plans'
          : wizard.stage === 'checkout' ? 'payment'
            : wizard.stage === 'intro' ? 'intro' : ''
    if (named) audience.step(named)
  }, [wizard.stage, wizard.index, wizard.goal, wizard.questions])

  useEffect(() => {
    if (questionnaireGoals().length) {
      setReady(true)
      return
    }
    loadQuestionnaireCatalog().then(() => setReady(true)).catch(() => setError('پرسش‌نامه بارگذاری نشد.'))
  }, [])

  useEffect(() => {
    if (!ready || booted.current) return
    booted.current = true
    const saved = readProgress()
    if (!saved) return
    const restored = useWizard.getState().hydrate(saved, questionnaireGoals())
    if (!restored) return
    const next = pathFor(useWizard.getState().stage)
    if (location.pathname.replace(/\/$/, '') !== next) navigate(next, { replace: true })
  }, [ready, location.pathname, navigate])

  useEffect(() => {
    if (!ready || !booted.current) return
    const state = useWizard.getState()
    const step = stepOf(state.stage, state.index, state.contactMode)
    writeProgress({
      goal: state.goal?.id,
      answersByNumber: state.answers,
      focused: state.index,
      unlocked: state.maxUnlocked,
      planId: state.plan,
      phone: state.phone,
      submissionId: state.submissionId,
      specialistId: state.specialistId,
      specialistIds: state.offered.map((person) => person.id),
      step,
    })
    if (applyingHistory.current) {
      applyingHistory.current = false
      return
    }
    const previous = (history.state as { mydiet?: { stage: string; index: number } } | null)?.mydiet ?? null
    const action = historyAction(previous, step)
    if (action === 'ignore') return
    const url = new URL(window.location.href)
    url.searchParams.set('at', step.stage === 'question' ? 'q' + step.index : step.stage)
    const data = { mydiet: step }
    if (action === 'replace') history.replaceState(data, '', url)
    else history.pushState(data, '', url)
  }, [ready, wizard.stage, wizard.index, wizard.contactMode, wizard.answers, wizard.plan, wizard.specialistId, wizard.goal])

  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      const step = (event.state as { mydiet?: { stage: string; index: number } } | null)?.mydiet
      if (!step) return
      applyingHistory.current = true
      useWizard.getState().applyHistory(step)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!ready || !booted.current) return
    const path = location.pathname.replace(/\/$/, '')
    const goalId = new URLSearchParams(location.search).get('goal')
    const state = useWizard.getState()
    if (path.endsWith('/payment')) {
      if (state.stage !== 'checkout' && state.stage !== 'verify') state.setStage('checkout')
      return
    }
    if (path.endsWith('/quiz')) {
      const goals = questionnaireGoals()
      if (goalId && state.goal?.id !== goalId) {
        const goal = goals.find((item) => item.id === goalId)
        if (goal) state.chooseGoal(goal)
      } else if (state.goal && (state.stage === 'intro' || state.stage === 'goals')) {
        state.setStage('quiz')
      }
      return
    }
    if (path.endsWith('/goals')) {
      if (state.stage === 'intro') state.setStage('goals')
    }
  }, [ready, location.pathname, location.search])

  const answered = wizard.questions.filter((item) => isAnswered(item, answerOf(item, wizard.answers))).length
  const progress = wizard.questions.length ? Math.round((answered / wizard.questions.length) * 100) : 0

  if (!ready) {
    return <main className="onboarding-shell grid min-h-screen place-items-center">{error || 'در حال بارگذاری پرسش‌نامه…'}</main>
  }

  return (
    <div className="onboarding-shell" dir="rtl">
      <div className="ambient-orb" style={{ width: 320, height: 320, top: -64, right: -64 }} />
      <div className="ambient-orb" style={{ width: 380, height: 380, bottom: -96, left: -80, animationDelay: '-5s' }} />
      {wizard.stage !== 'plans' && wizard.stage !== 'verify' && wizard.stage !== 'checkout' && <header>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <button id="appLogoHomeBtn" type="button" className="header-logo-btn" onClick={() => { wizard.setStage('intro'); navigate('/onboarding') }}>
            <BrandLogo variant="symbol" className="app-logo-img" size={40} decorative />
            <span><BrandLogo variant="wordmark" size={30} /></span>
          </button>
          <div id="headerQuizProgress" aria-label="پیشرفت پرسشنامه">
            <span id="headerQuestionChip">{wizard.stage === 'quiz' && wizard.questions.length ? `${faDigits(wizard.index + 1)} / ${faDigits(wizard.questions.length)}` : 'شروع'}</span>
            <div className="header-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div id="headerProgressFill" style={{ width: progress + '%' }} />
            </div>
          </div>
          <div id="headerQuizActions">
            <button id="scrollPrevAnsweredBtn" type="button" aria-label="سوال قبلی" disabled={wizard.index === 0} onClick={() => wizard.setIndex(wizard.index - 1)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
            </button>
            <button id="scrollNextUnlockedBtn" type="button" aria-label="سوال بعدی" disabled={wizard.index >= wizard.maxUnlocked} onClick={() => wizard.setIndex(wizard.index + 1)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
          </div>
        </div>
      </header>}
      <main
        className={
          wizard.stage === 'quiz' || wizard.stage === 'plans' || wizard.stage === 'verify' || wizard.stage === 'checkout'
            ? 'relative z-10 w-full max-w-none px-0 py-0'
            : 'relative z-10 max-w-4xl mx-auto px-4 py-6'
        }
      >
        {(wizard.stage === 'intro' || wizard.stage === 'goals') && (
          <section id="page1Container" className="min-h-[78vh] flex flex-col justify-center items-center">
            {wizard.stage === 'intro'
              ? <IntroStage onStart={() => { wizard.setStage('goals'); navigate('/onboarding/goals') }} />
              : <GoalsStage />}
          </section>
        )}
        {wizard.stage === 'quiz' && (
          <QuizStage onSubmit={() => wizard.setStage('preparing')} />
        )}
        {(wizard.stage === 'preparing' || wizard.stage === 'specialists') && (
          <section id="pageAiPreparingContainer">
            <div className="ai-prep-card w-full max-w-md rounded-3xl border-2 p-8 text-center shadow-xl">
              {wizard.stage === 'preparing'
                ? <PreparingStage onDone={showPreparing} />
                : <SpecialistsStage onContinue={() => wizard.setStage('plans')} />}
            </div>
          </section>
        )}
        {wizard.stage === 'plans' && <PlansStage onBuy={() => wizard.setStage('verify')} />}
        {wizard.stage === 'verify' && <VerifyStage />}
        {wizard.stage === 'checkout' && <CheckoutStage />}
      </main>
    </div>
  )
}
