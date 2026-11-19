import type { PlanId } from '../domain/questionnaire'

export interface CheckoutSession {
  token: string
  submissionId: string
  plan: PlanId
}

const KEY = 'mydiet.checkout'

export function readCheckoutSession(): CheckoutSession | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY) || 'null') as Partial<CheckoutSession> | null
    if (parsed?.token && parsed.submissionId && parsed.plan) return parsed as CheckoutSession
  } catch { /* private mode */ }
  return null
}

export function writeCheckoutSession(session: CheckoutSession) {
  sessionStorage.setItem(KEY, JSON.stringify(session))
}
