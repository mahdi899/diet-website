import type { PlanId } from '../domain/questionnaire'

export interface SubmissionAnswer {
  question: string
  answer: string
  key?: string
  codes?: string[]
}

export interface TransferOrder {
  id: string
  plan: PlanId
  amount_toman: number
  expires_at: string
  confirmed_at?: string | null
  gateway_started?: boolean
}

export interface OnboardingGateway {
  submit(body: { id: string; phone: string; goal?: string; specialistId: string; answers: SubmissionAnswer[] }): Promise<unknown>
  requestOtp(phone: string): Promise<unknown>
  verifyOtp(phone: string, code: string): Promise<string>
  verifySubmission(id: string, token: string, journeyId: string): Promise<unknown>
  transfer<T>(path: string, body: unknown, token: string): Promise<T>
  communityCount(): Promise<number | null>
}

export interface SmsRequest {
  phone: string
  submissionId: string
  goalId?: string
  specialistId: string
  answers: SubmissionAnswer[]
}

export async function requestSms(gateway: OnboardingGateway, input: SmsRequest) {
  await gateway.submit({
    id: input.submissionId,
    phone: input.phone,
    goal: input.goalId,
    specialistId: input.specialistId,
    answers: input.answers,
  })
  await gateway.requestOtp(input.phone)
}

export async function confirmSms(gateway: OnboardingGateway, input: { phone: string; code: string; submissionId: string; journeyId: string }) {
  const token = await gateway.verifyOtp(input.phone, input.code)
  await gateway.verifySubmission(input.submissionId, token, input.journeyId)
  return token
}

export function createTransfer(gateway: OnboardingGateway, token: string, plan: PlanId, submissionId: string) {
  return gateway.transfer<TransferOrder>('', { plan, submissionId }, token)
}

export function readTransfer(gateway: OnboardingGateway, token: string, id: string) {
  return gateway.transfer<TransferOrder>('/' + encodeURIComponent(id), undefined, token)
}

export function startGateway(gateway: OnboardingGateway, token: string, id: string) {
  return gateway.transfer<{ url?: string }>('/' + encodeURIComponent(id) + '/zibal', {}, token)
}
