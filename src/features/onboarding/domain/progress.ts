export type Stage = 'intro' | 'goals' | 'quiz' | 'preparing' | 'specialists' | 'plans' | 'verify' | 'checkout'

export interface HistoryStep {
  stage: string
  index: number
}

export interface SavedProgress {
  goal?: string
  answersByNumber?: Record<string, unknown>
  focused?: number
  unlocked?: number
  planId?: string | null
  phone?: string
  submissionId?: string | null
  specialistId?: string | null
  specialistIds?: string[]
  step?: HistoryStep
}

export function historyAction(previous: HistoryStep | null, next: HistoryStep | null) {
  if (!next?.stage) return 'ignore'
  if (previous && previous.stage === next.stage && previous.index === next.index) return 'ignore'
  if (!previous) return 'replace'
  if (next.stage === 'specialists' && previous.stage === 'preparing') return 'replace'
  return 'push'
}

export function stepOf(stage: Stage, index: number, contactMode: 'phone' | 'otp'): HistoryStep {
  if (stage === 'quiz') return { stage: 'question', index }
  if (stage === 'verify') return { stage: contactMode, index: 0 }
  if (stage === 'checkout') return { stage: 'payment', index: 0 }
  return { stage, index: 0 }
}

export function pathFor(stage: Stage) {
  if (stage === 'checkout') return '/onboarding/payment'
  if (stage === 'quiz') return '/onboarding/quiz'
  if (stage === 'goals') return '/onboarding/goals'
  return '/onboarding'
}
