import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  answerOf,
  assetUrl,
  faDigits,
  followUpRequired,
  isAnswered,
  isHeightQuestion,
  isWeightQuestion,
  lossPaceText,
  metricConfig,
  needsMedicalReview,
  visibleQuestions,
  type AnswerValue,
  type QuizQuestion,
} from '../../../domain/questionnaire'
import { useWizard } from '../../../application/wizard-store'
import { HeightRuler, WeightGauge, WeightGuidance } from '../metrics'

function CheckIcon() {
  return (
    <svg className="demo-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function selectedIndex(question: QuizQuestion, answer: AnswerValue | undefined, index: number) {
  if (question.multi) return Boolean(answer && typeof answer === 'object' && 'choices' in answer && answer.choices.includes(index))
  if (typeof answer === 'number') return answer === index
  return Boolean(answer && typeof answer === 'object' && 'choice' in answer && answer.choice === index)
}

function optionLockedByExclusive(question: QuizQuestion, answer: AnswerValue | undefined, optionIndex: number) {
  const exclusive = question.exclusiveLabels ?? []
  if (!exclusive.length) return false
  const label = question.options?.[optionIndex]?.label ?? ''
  const choices = answer && typeof answer === 'object' && 'choices' in answer ? answer.choices : []
  const exclusiveActive = choices.some((item) => exclusive.includes(question.options?.[item]?.label ?? ''))
  return exclusiveActive && !exclusive.includes(label)
}

export function QuizStage({ onSubmit }: { onSubmit: () => void }) {
  const navigate = useNavigate()
  const wizard = useWizard()
  const question = wizard.questions[wizard.index]
  const answer = question ? answerOf(question, wizard.answers) : undefined
  const storedDetail = answer && typeof answer === 'object' && 'detail' in answer ? String(answer.detail ?? '') : ''
  const [detail, setDetail] = useState(storedDetail)
  const [error, setError] = useState('')
  const detailKey = question?.originalNumber + ':' + storedDetail
  const [seenDetailKey, setSeenDetailKey] = useState(detailKey)
  if (detailKey !== seenDetailKey) {
    setSeenDetailKey(detailKey)
    setDetail(storedDetail)
  }

  const answeredCount = wizard.questions.filter((item) => isAnswered(item, answerOf(item, wizard.answers))).length

  function refreshVisible(changed?: QuizQuestion) {
    const state = useWizard.getState()
    if (!state.goal) return state.questions
    const next = visibleQuestions(state.goal.id, state.allQuestions, state.answers)
    state.setQuestions(next)
    if (changed) {
      const at = next.findIndex((item) => item.originalNumber === changed.originalNumber)
      if (at >= 0) state.setIndex(at)
    }
    return next
  }

  function goNext(current: QuizQuestion) {
    const list = refreshVisible(current)
    const at = list.findIndex((item) => item.originalNumber === current.originalNumber)
    if (at < list.length - 1) {
      wizard.unlock(at + 1)
      wizard.setIndex(at + 1)
    } else {
      wizard.setIndex(Math.max(0, at))
    }
    setError('')
  }

  function chooseOption(optionIndex: number) {
    if (!question) return
    const number = question.originalNumber ?? -1
    if (question.multi) {
      const current = answer && typeof answer === 'object' && 'choices' in answer ? answer.choices : []
      const label = question.options?.[optionIndex]?.label ?? ''
      const exclusive = question.exclusiveLabels ?? []
      const choices = current.includes(optionIndex)
        ? current.filter((item) => item !== optionIndex)
        : exclusive.includes(label)
          ? [optionIndex]
          : [...current.filter((item) => !exclusive.includes(question.options?.[item]?.label ?? '')), optionIndex]
      wizard.setAnswer(number, { choices, detail })
      return
    }
    const value: AnswerValue = followUpRequired(question, optionIndex) ? { choice: optionIndex, detail } : optionIndex
    wizard.setAnswer(number, value)
    if (!followUpRequired(question, optionIndex) && !needsMedicalReview(question, value)) goNext(question)
  }

  function continueIfAnswered() {
    if (!question) return
    const current = answerOf(question, useWizard.getState().answers)
    if (!isAnswered(question, current)) {
      setError('پاسخ را کامل کنید.')
      return
    }
    goNext(question)
  }

  const paceNote = useMemo(() => (
    question?.ui === 'loss-pace'
      ? 'زمان‌ها برای رسیدن از وزن فعلی به وزن هدف محاسبه شده‌اند و فقط برآورد اولیه‌اند. شرایط بدنی می‌تواند این زمان را بیشتر کند.'
      : ''
  ), [question])

  if (!question || !wizard.goal) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <p>اول هدفت را انتخاب کن.</p>
        <button type="button" className="quiz-green-btn mt-4 px-6 py-3 rounded-xl" onClick={() => navigate('/onboarding/goals')}>انتخاب هدف</button>
      </section>
    )
  }

  const showImageTitle = question.ui === 'age-range' || question.ui === 'option-cards' || question.ui === 'sleep-wake'
  const allAnswered = answeredCount === wizard.questions.length

  return (
    <section id="page2Container">
      <div>
        <div className="flex items-center justify-between gap-3">
          <button id="backToGoalsBtn" type="button" className="quiz-green-btn px-3 py-2 rounded-xl text-xs" onClick={() => { wizard.setStage('goals'); navigate('/onboarding/goals') }}>
            تغییر هدف
          </button>
          <strong className="text-sm">هدف: {wizard.goal.title}</strong>
        </div>
        <div />
      </div>
      <div className="relative">
        <div id="quizScrollViewport" className="quiz-single-view">
          <div id="questionsVerticalList" className="quiz-question-stack">
            <div className="quiz-question-hero quiz-question-hero--fixed" aria-hidden="true">
              <img src={assetUrl('assets/quiz-hero-diet.jpg')} alt="" />
            </div>
            <article className={`question-card question-step-enter state-active ${showImageTitle ? 'age-question-shell' : ''}`}>
              <div>
                <span>سوال {faDigits(wizard.index + 1)} از {faDigits(wizard.questions.length)}</span>
              </div>
              <h3 className={showImageTitle ? 'age-range-question-title' : undefined}>{question.q}</h3>
              {question.multi && <p className="text-sm mb-3" style={{ color: '#205638' }}>می‌تونی چند گزینه انتخاب کنی</p>}
              <QuestionBody
                question={question}
                answer={answer}
                questions={wizard.questions}
                answers={wizard.answers}
                detail={detail}
                onDetail={(value) => {
                  setDetail(value)
                  if (answer && typeof answer === 'object' && 'choices' in answer) wizard.setAnswer(question.originalNumber ?? -1, { choices: answer.choices, detail: value })
                  if (answer && typeof answer === 'object' && 'choice' in answer) wizard.setAnswer(question.originalNumber ?? -1, { choice: answer.choice, detail: value })
                }}
                onOption={chooseOption}
                onValue={(value) => wizard.setAnswer(question.originalNumber ?? -1, value)}
                onContinue={continueIfAnswered}
              />
              {paceNote && <p className="loss-pace-note">{paceNote}</p>}
              {needsMedicalReview(question, answer) && (
                <div className="weight-guidance" role="alert">
                  <strong>پیش از برنامهٔ غذایی، بررسی پزشک لازم است</strong>
                  <p>کاهش وزن ناخواسته باید توسط پزشک بررسی شود. این پاسخ در پرونده ثبت می‌شود.</p>
                  <button type="button" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-3" onClick={() => goNext(question)}>متوجه شدم؛ ادامهٔ پرسش‌نامه</button>
                </div>
              )}
            </article>
          </div>
          {allAnswered && (
            <div id="submitAnswersSection" className="quiz-submit-bar w-full max-w-[560px] mx-auto px-4 pb-6 pt-2 text-center box-border">
              <button type="button" className="quiz-green-btn cta-pulse w-full py-4 rounded-2xl font-black text-lg" onClick={onSubmit}>
                ثبت پاسخ‌ها
              </button>
            </div>
          )}
          {error && <p className="text-center text-sm pb-4" style={{ color: '#a43b3b' }}>{error}</p>}
        </div>
      </div>
    </section>
  )
}

function QuestionBody({
  question,
  answer,
  questions,
  answers,
  detail,
  onDetail,
  onOption,
  onValue,
  onContinue,
}: {
  question: QuizQuestion
  answer: AnswerValue | undefined
  questions: QuizQuestion[]
  answers: Record<number, AnswerValue | undefined>
  detail: string
  onDetail: (value: string) => void
  onOption: (index: number) => void
  onValue: (value: AnswerValue) => void
  onContinue: () => void
}) {
  if (question.ui === 'sleep-wake') {
    const sleep = answer && typeof answer === 'object' && 'sleep' in answer ? answer.sleep : 23
    const wake = answer && typeof answer === 'object' && 'wake' in answer ? answer.wake : 7
    const set = (next: { sleep: number; wake: number }) => onValue(next)
    return (
      <div className="swp-card" dir="ltr">
        <div className="swp-labels"><span>ساعت خواب</span><span>ساعت بیداری</span></div>
        <div className="swp-row">
          <HourSlot label="ساعت خواب" value={sleep} onChange={(value) => set({ sleep: value, wake })} />
          <HourSlot label="ساعت بیداری" value={wake} onChange={(value) => set({ sleep, wake: value })} />
        </div>
        <p className="swp-help" dir="rtl">برای تنظیم، روی عدد بالا و پایین بزن.</p>
        <button type="button" data-field-submit="" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-4" onClick={() => { set({ sleep, wake }); onContinue() }}>ثبت و ادامه</button>
      </div>
    )
  }

  if (question.type === 'number') {
    const slider = metricConfig(question, answers, questions)
    const value = typeof answer === 'string' || typeof answer === 'number' ? Number(answer) : slider.default
    const safe = Number.isFinite(value) ? value : slider.default
    if (slider.max < slider.min) return <p>با وزن فعلی، در بازهٔ این پرسش‌نامه وزن هدف قابل انتخاب نیست.</p>
    if (isHeightQuestion(question)) {
      return <HeightRuler min={slider.min} max={slider.max} value={safe} onChange={(next) => onValue(String(next))} onContinue={() => { onValue(String(safe)); onContinue() }} />
    }
    if (isWeightQuestion(question)) {
      return (
        <>
          <WeightGauge min={slider.min} max={slider.max} value={safe} onChange={(next) => onValue(String(Math.round(next)))} onContinue={() => { onValue(String(safe)); onContinue() }} />
          <WeightGuidance question={question} questions={questions} answers={answers} value={safe} />
        </>
      )
    }
    const fill = slider.max === slider.min ? 0 : ((safe - slider.min) / (slider.max - slider.min)) * 100
    return (
      <div className="metric-slider-card">
        <div className="metric-slider-display">
          <span className="metric-slider-value">{faDigits(safe)}</span>
          <div className="metric-slider-divider" aria-hidden="true" />
          <span className="metric-slider-unit">{slider.unit}</span>
        </div>
        <div className="metric-slider-track-wrap">
          <input
            className="metric-slider-input"
            type="range"
            dir="ltr"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={safe}
            style={{ ['--fill' as string]: fill + '%' }}
            onChange={(event) => onValue(event.target.value)}
          />
        </div>
        <button type="button" data-field-submit="" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-4" onClick={() => { onValue(String(safe)); onContinue() }}>ثبت و ادامه</button>
      </div>
    )
  }

  if (question.type === 'text') {
    const value = typeof answer === 'string' && answer !== '__skipped__' ? answer : ''
    return (
      <div className="quiz-text-card">
        <input
          className="quiz-field w-full px-4 py-3 rounded-xl"
          dir="rtl"
          placeholder={question.placeholder}
          value={value}
          onChange={(event) => onValue(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); onContinue() } }}
        />
        <button type="button" data-field-submit="" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-3" onClick={onContinue}>ثبت و ادامه</button>
        {question.optional && (
          <button type="button" data-skip-index="" className="quiz-skip-btn w-full py-3 text-sm" onClick={() => { onValue('__skipped__'); onContinue() }}>رد شدن از این سؤال</button>
        )}
      </div>
    )
  }

  if (question.ui === 'age-range') {
    return (
      <div className="age-range-list">
        {question.options?.map((option, index) => {
          const selected = selectedIndex(question, answer, index)
          return (
            <button key={option.label} type="button" data-q-index={index} className={'age-range-card' + (selected ? ' age-range-card--selected' : '')} onClick={() => onOption(index)}>
              <span className="age-range-radio" aria-hidden="true"><span className="age-range-radio-mark">{selected ? <CheckIcon /> : null}</span></span>
              <span className="age-range-label">{option.label}</span>
              <span className="age-range-photo-wrap"><img className="age-range-photo" src={assetUrl(option.image || 'assets/vegetables.jpg')} alt="" /></span>
            </button>
          )
        })}
      </div>
    )
  }

  if (question.ui === 'option-cards') {
    return (
      <div className="quiz-flash-grid">
        {question.options?.map((option, index) => {
          const selected = selectedIndex(question, answer, index)
          return (
            <button key={option.label} type="button" data-q-index={index} className={'quiz-option-card quiz-flash-card' + (selected ? ' quiz-option-card--selected' : '')} onClick={() => onOption(index)}>
              <span className="quiz-flash-photo"><img src={assetUrl(option.image || 'assets/vegetables.jpg')} alt="" /></span>
              <span className="quiz-flash-foot">
                <span className="quiz-flash-label">{option.label}</span>
                <span className="quiz-choice-dot" aria-hidden="true">{selected ? <CheckIcon /> : null}</span>
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  const compact = (question.options?.length ?? 0) >= 6
  const needsDetail = Boolean(question.followUpText && answer && typeof answer === 'object' && (
    ('choices' in answer && answer.choices.some((index) => followUpRequired(question, index))) ||
    ('choice' in answer && followUpRequired(question, answer.choice))
  ))

  return (
    <div>
      <div className={compact ? 'quiz-choice-grid quiz-choice-grid--compact' : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'}>
        {question.options?.map((option, index) => {
          const selected = selectedIndex(question, answer, index)
          const locked = optionLockedByExclusive(question, answer, index)
          return (
            <button
              key={option.label}
              type="button"
              data-q-index={index}
              disabled={locked}
              className={
                'quiz-option-btn w-full text-right p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3'
                + (selected ? ' is-selected' : '')
                + (locked ? ' is-choice-locked' : '')
              }
              onClick={() => onOption(index)}
            >
              <span className="text-sm font-bold leading-snug flex-1">
                {option.label}
                {question.ui === 'loss-pace' && option.pace && <small className="loss-pace-description">{lossPaceText(option.pace, questions, answers)}</small>}
              </span>
              <span className="quiz-choice-dot" aria-hidden="true">{selected ? <CheckIcon /> : null}</span>
              {option.image && <span className="quiz-option-thumb-wrap"><img className="quiz-option-thumb" src={assetUrl(option.image)} alt="" /></span>}
            </button>
          )
        })}
      </div>
      {needsDetail && (
        <label className="block text-sm font-bold mt-3" style={{ color: '#205638' }}>
          {question.followUpLabel || question.followUpPlaceholder || 'جزئیات را بنویسید'}
          <input className="quiz-detail w-full px-4 py-3 rounded-xl mt-2" value={detail} placeholder={question.followUpPlaceholder} onChange={(event) => onDetail(event.target.value)} />
        </label>
      )}
      {(question.multi || needsDetail) && (
        <button type="button" data-multi-submit="" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-3" onClick={onContinue}>ثبت و ادامه</button>
      )}
    </div>
  )
}

function HourSlot({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="swp-slot">
      <button type="button" className="swp-nudge" aria-label={`${label}، یک ساعت بعدتر`} onClick={() => onChange((value + 1) % 24)}>▲</button>
      <div className="swp-value-box">
        <input className="swp-value swp-hour-input" readOnly aria-label={label} value={faDigits(value)} />
      </div>
      <button type="button" className="swp-nudge" aria-label={`${label}، یک ساعت زودتر`} onClick={() => onChange((value + 23) % 24)}>▼</button>
    </div>
  )
}
