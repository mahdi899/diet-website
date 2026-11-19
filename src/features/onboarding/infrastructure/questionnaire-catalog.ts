import type { AnswerValue, QuizGoal, QuizQuestion } from '../domain/questionnaire'

declare global {
  interface Window {
    SABZINE_QUESTIONNAIRE?: { goals: QuizGoal[] }
    SabzineKeys?: {
      canonical: (question: QuizQuestion, answer: unknown) => Record<string, unknown>
    }
  }
}

export function questionnaireGoals() {
  return window.SABZINE_QUESTIONNAIRE?.goals ?? []
}

export function canonicalAnswer(question: QuizQuestion, answer: AnswerValue | undefined) {
  return window.SabzineKeys?.canonical(question, answer) ?? {}
}

function loadScript(src: string) {
  const existing = document.querySelector<HTMLScriptElement>(`script[data-src="${src}"]`)
  if (existing?.dataset.loaded === '1') return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => {
      script.dataset.loaded = '1'
      resolve()
    }, { once: true })
    script.addEventListener('error', () => reject(new Error(src)), { once: true })
    if (!existing) {
      script.src = src
      script.dataset.src = src
      document.body.appendChild(script)
    }
  })
}

export async function loadQuestionnaireCatalog() {
  if (questionnaireGoals().length) return questionnaireGoals()
  await Promise.all([
    loadScript('/onboarding/questionnaire-data.js'),
    loadScript('/onboarding/onboarding-keys.js'),
  ])
  const goals = questionnaireGoals()
  if (!goals.length) throw new Error('پرسش‌نامه بارگذاری نشد.')
  return goals
}
