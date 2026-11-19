import { confirmSms, createTransfer, readTransfer, requestSms, startGateway } from './application/ports'
import { onboardingApi } from './infrastructure/onboarding-api'
import { audience } from './infrastructure/audience-tracking'

export { canonicalAnswer, loadQuestionnaireCatalog, questionnaireGoals } from './infrastructure/questionnaire-catalog'
export { readCheckoutSession, writeCheckoutSession } from './infrastructure/checkout-session'
export { readProgress, writeProgress } from './infrastructure/progress-storage'
export { audience }

export const onboarding = {
  requestSms: (input: Parameters<typeof requestSms>[1]) => requestSms(onboardingApi, input),
  confirmSms: (input: Parameters<typeof confirmSms>[1]) => confirmSms(onboardingApi, input),
  createTransfer: (token: string, plan: Parameters<typeof createTransfer>[2], submissionId: string) => createTransfer(onboardingApi, token, plan, submissionId),
  readTransfer: (token: string, id: string) => readTransfer(onboardingApi, token, id),
  startGateway: (token: string, id: string) => startGateway(onboardingApi, token, id),
  refreshToken: (token: string) => onboardingApi.refreshToken(token),
  communityCount: () => onboardingApi.communityCount(),
  installTracking: () => audience.install(),
}
