import { useEffect, useState } from 'react'
import { needsMedicalReview, specialists, answerOf } from '../../../domain/questionnaire'
import { onboarding } from '../../../composition'
import { useWizard } from '../../../application/wizard-store'

function portraitStyle(id: string) {
  const sprite = specialists.find((person) => person.id === id)?.sprite ?? 0
  return { backgroundPosition: `${(sprite % 5) * 25}% ${sprite < 5 ? 0 : 100}%` }
}

export function SpecialistsStage({ onContinue }: { onContinue: () => void }) {
  const offered = useWizard((state) => state.offered)
  const specialistId = useWizard((state) => state.specialistId)
  const setSpecialist = useWizard((state) => state.setSpecialist)
  const questions = useWizard((state) => state.questions)
  const answers = useWizard((state) => state.answers)
  const needsReview = questions.some((question) => needsMedicalReview(question, answerOf(question, answers)))
  const [memberCount, setMemberCount] = useState(1000)

  useEffect(() => {
    let target = 1622
    let timer = 0
    let cancelled = false
    const started = performance.now()
    onboarding.communityCount()
      .then((count) => {
        if (count) target = count
      })
      .catch(() => {})
      .finally(() => {
        if (cancelled) return
        const span = Math.min(120, Math.max(24, Math.round(target * 0.04)))
        const from = Math.max(1, target - span)
        setMemberCount(from)
        timer = window.setInterval(() => {
          const t = Math.min(1, (performance.now() - started) / 1400)
          setMemberCount(Math.round(from + (target - from) * (1 - (1 - t) ** 3)))
          if (t === 1) window.clearInterval(timer)
        }, 40)
      })
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  return (
    <div id="aiReadyPhase" className="ai-prep-phase ai-prep-phase--ready">
      <div className="community-hero">
        <p className="community-hero-number" aria-live="polite">{memberCount.toLocaleString('fa-IR')}</p>
        <p className="community-hero-copy">نفری هستی که عضو<br />جامعه رژیم من میشی</p>
      </div>
      <p className="matching-section-lead">۲ پروفایل نمونهٔ تغذیه</p>
      {needsReview && (
        <p id="medicalReviewSummary" className="weight-guidance">
          با توجه به کاهش وزن ناخواسته، پیش از دریافت برنامهٔ غذایی به بررسی پزشک نیاز داری. انتخاب پلن جایگزین مشاوره و علت‌یابی پزشکی نیست.
        </p>
      )}
      <div id="specialistList" className="specialist-list" role="group" aria-label="انتخاب متخصص">
        {offered.map((person) => {
          const selected = specialistId === person.id
          return (
            <button
              key={person.id}
              type="button"
              className={'specialist-card' + (selected ? ' is-selected' : '')}
              aria-pressed={selected}
              onClick={() => setSpecialist(person.id)}
            >
              <span className="specialist-portrait-group">
                <span className="specialist-portrait specialist-portrait--generated" style={portraitStyle(person.id)} aria-hidden="true" />
                <span className="specialist-rating">
                  <span className="stars" aria-hidden="true"><i /><i /><i /><i /><i className="is-partial" /></span>
                  <span className="star-score">۴٫۸</span>
                </span>
              </span>
              <span className="specialist-copy">
                <span className="specialist-name">{person.name}</span>
                <span className="specialist-role">متخصص تغذیه</span>
                <span className="specialist-focus">{person.focus}</span>
              </span>
              <span className="specialist-mark" aria-hidden="true" />
            </button>
          )
        })}
      </div>
      <button id="aiReadyGoBtn" type="button" className="quiz-green-btn w-full" disabled={!specialistId} onClick={onContinue}>
        <span>انتخاب پلن و ادامه</span>
        <span aria-hidden="true">←</span>
      </button>
    </div>
  )
}
