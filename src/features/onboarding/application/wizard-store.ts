import { create } from 'zustand'
import {
  prepareQuestions,
  sampleSpecialists,
  specialists,
  visibleQuestions,
  type AnswerValue,
  type QuizGoal,
  type QuizQuestion,
} from '../domain/questionnaire'
import type { Stage } from '../domain/progress'

export type { Stage }

interface WizardStore {
  stage: Stage
  goal: QuizGoal | null
  allQuestions: QuizQuestion[]
  questions: QuizQuestion[]
  answers: Record<number, AnswerValue | undefined>
  index: number
  maxUnlocked: number
  phone: string
  submissionId: string
  token: string
  specialistId: string
  offered: { id: string; name: string; focus: string }[]
  plan: 'weekly' | 'monthly' | 'quarterly'
  contactMode: 'phone' | 'otp'
  setStage: (stage: Stage) => void
  setContactMode: (mode: 'phone' | 'otp') => void
  chooseGoal: (goal: QuizGoal) => void
  setQuestions: (questions: QuizQuestion[]) => void
  setAnswer: (number: number, value: AnswerValue | undefined) => void
  setIndex: (index: number) => void
  unlock: (index: number) => void
  setPhone: (phone: string) => void
  setToken: (token: string) => void
  setSpecialist: (id: string) => void
  setPlan: (plan: WizardStore['plan']) => void
  resetSubmission: (phone: string) => void
  replaceGoal: (goal: QuizGoal, answers: Record<number, AnswerValue | undefined>) => void
  hydrate: (saved: {
    goal?: string
    answersByNumber?: Record<string, unknown>
    focused?: number
    unlocked?: number
    planId?: string | null
    phone?: string
    submissionId?: string | null
    specialistId?: string | null
    specialistIds?: string[]
    step?: { stage: string; index: number }
  }, goals: QuizGoal[]) => boolean
  applyHistory: (step: { stage: string; index: number }) => void
}

export const useWizard = create<WizardStore>((set, get) => ({
  stage: 'intro',
  goal: null,
  allQuestions: [],
  questions: [],
  answers: {},
  index: 0,
  maxUnlocked: 0,
  phone: '',
  submissionId: crypto.randomUUID(),
  token: '',
  specialistId: '',
  offered: [],
  plan: 'monthly',
  contactMode: 'phone',
  setStage: (stage) => set({ stage }),
  setContactMode: (contactMode) => set({ contactMode }),
  chooseGoal: (goal) => set({
    goal,
    allQuestions: prepareQuestions(goal),
    questions: prepareQuestions(goal),
    answers: {},
    index: 0,
    maxUnlocked: 0,
    stage: 'quiz',
    offered: sampleSpecialists(),
    specialistId: '',
  }),
  setQuestions: (questions) => set({ questions }),
  setAnswer: (number, value) => set({ answers: { ...get().answers, [number]: value } }),
  setIndex: (index) => set({ index }),
  unlock: (index) => set({ maxUnlocked: Math.max(get().maxUnlocked, index) }),
  setPhone: (phone) => set({ phone }),
  setToken: (token) => set({ token }),
  setSpecialist: (specialistId) => set({ specialistId }),
  setPlan: (plan) => set({ plan }),
  resetSubmission: (phone) => {
    if (get().phone === phone) return
    set({ phone, submissionId: crypto.randomUUID() })
  },
  replaceGoal: (goal, answers) => {
    const allQuestions = prepareQuestions(goal)
    const questions = visibleQuestions(goal.id, allQuestions, answers)
    const weight = questions.find((question) => question.metric === 'current-weight')
    const index = Math.max(0, weight ? questions.indexOf(weight) : 0)
    set({ goal, allQuestions, questions, answers, index, maxUnlocked: index, stage: 'quiz' })
  },
  hydrate: (saved, goals) => {
    const goal = goals.find((item) => item.id === saved.goal)
    if (!goal) return false
    const answers = saved.answersByNumber ?? {}
    const typed: Record<number, AnswerValue | undefined> = {}
    for (const [key, value] of Object.entries(answers)) typed[Number(key)] = value as AnswerValue
    const allQuestions = prepareQuestions(goal)
    const questions = visibleQuestions(goal.id, allQuestions, typed)
    const index = Math.max(0, Math.min(saved.focused ?? 0, Math.max(0, questions.length - 1)))
    const offered = (saved.specialistIds ?? [])
      .map((id) => specialists.find((person) => person.id === id))
      .filter((person): person is (typeof specialists)[number] => Boolean(person))
    const stage = stageFrom(saved.step?.stage)
    const plans = ['weekly', 'monthly', 'quarterly'] as const
    const plan = plans.find((item) => item === saved.planId) ?? 'monthly'
    set({
      goal,
      allQuestions,
      questions,
      answers: typed,
      index,
      maxUnlocked: Math.max(index, saved.unlocked ?? 0),
      stage,
      plan,
      phone: saved.phone ?? '',
      submissionId: saved.submissionId || crypto.randomUUID(),
      specialistId: saved.specialistId ?? '',
      offered: offered.length ? offered : sampleSpecialists(),
      contactMode: saved.step?.stage === 'otp' ? 'otp' : 'phone',
    })
    return true
  },
  applyHistory: (step) => {
    const stage = stageFrom(step.stage)
    if (step.stage === 'question') {
      const length = get().questions.length
      const index = Math.max(0, Math.min(step.index || 0, Math.max(0, length - 1)))
      set({ stage: 'quiz', index, maxUnlocked: Math.max(get().maxUnlocked, index) })
      return
    }
    set({
      stage,
      contactMode: step.stage === 'otp' ? 'otp' : 'phone',
    })
  },
}))

function stageFrom(name: string | undefined): Stage {
  if (name === 'question') return 'quiz'
  if (name === 'phone' || name === 'otp') return 'verify'
  if (name === 'payment') return 'checkout'
  if (name === 'goals' || name === 'preparing' || name === 'specialists' || name === 'plans' || name === 'verify' || name === 'checkout' || name === 'intro') return name
  return 'intro'
}
