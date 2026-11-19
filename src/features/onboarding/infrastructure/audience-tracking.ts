/** Anonymous funnel telemetry for the admin audience report. No answers or input values are sent. */

const GOALS = new Set(['weight_loss', 'weight_gain', 'pregnancy', 'detox'])
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const STEP = /^(intro|goals|quiz|preparing|specialists|plans|contact|otp|payment|payment_gateway|payment_transfer|payment_success|question:(weight_loss|weight_gain|pregnancy|detox):\d{1,3})$/
const JOURNEY_KEY = 'mydiet.analytics.journey'
const WEBSITE_ID = 'd3a0eb23-8565-4267-b16d-6cd5111d3ff1'

interface TrackItem {
  name: string
  data: Record<string, unknown>
}

interface SavedJourney {
  id?: string
  page?: string
  attribution?: Record<string, string>
}

declare global {
  interface Window {
    MYDIET_TRACKING?: { websiteId?: string }
    umami?: { track: (name?: string, data?: Record<string, unknown>) => Promise<unknown> | void }
    mydietBeforeSend?: (type: string, payload: UmamiPayload) => UmamiPayload | false
    demoTracking?: {
      step: (name: string, data?: { goal?: string; question?: number }) => void
      complete: () => void
      registered: () => void
      journeyId: () => string
    }
  }
}

interface UmamiPayload {
  url: string
  referrer?: string
  title?: string
  data?: Record<string, unknown>
}

function pageOf(pathname: string) {
  if (pathname.endsWith('/payment')) return 'payment'
  if (pathname.endsWith('/quiz')) return 'quiz'
  if (pathname.endsWith('/goals')) return 'goals'
  return 'intro'
}

function safeToken(value: string | null) {
  return value && /^[a-zA-Z0-9_.-]{1,80}$/.test(value) ? value : ''
}

let installed = false

export function installAudienceTracking() {
  if (installed || typeof window === 'undefined') return
  const websiteId = window.MYDIET_TRACKING?.websiteId || WEBSITE_ID
  if (!websiteId || navigator.doNotTrack === '1') return
  const privacy = navigator as Navigator & { globalPrivacyControl?: boolean }
  if (privacy.globalPrivacyControl) return
  try {
    if (localStorage.getItem('mydiet.analytics.disabled') === '1') return
  } catch { /* storage may be blocked */ }

  installed = true
  const queue: TrackItem[] = []
  const page = pageOf(location.pathname)
  const entryParams = new URLSearchParams(location.search)
  let current = page
  let journey = ''
  let attribution: Record<string, string> = {}
  let context: Record<string, unknown> = {}
  let lastTick = performance.now()
  let lastActivity = lastTick
  let activeMs = 0
  let hidden = document.hidden

  const rememberJourney = () => {
    try { sessionStorage.setItem(JOURNEY_KEY, JSON.stringify({ id: journey, page, attribution })) } catch { /* ignore */ }
  }

  const selectJourney = () => {
    let saved: SavedJourney | null = null
    try { saved = JSON.parse(sessionStorage.getItem(JOURNEY_KEY) || 'null') as SavedJourney | null } catch { /* ignore */ }
    const valid = Boolean(saved && typeof saved.id === 'string' && /^[0-9a-f-]{36}$/.test(saved.id))
    const restart = page === 'intro' || (saved?.page === 'quiz' && page !== 'payment')
    journey = valid && !restart && saved?.id ? saved.id : crypto.randomUUID()
    attribution = {}
    for (const key of CAMPAIGN_KEYS) {
      const value = entryParams.get(key) ?? (valid && page !== 'intro' ? saved?.attribution?.[key] ?? null : null)
      const safe = safeToken(value)
      if (safe) attribution[key] = safe
    }
    rememberJourney()
  }
  selectJourney()

  const event = (name: string, data: Record<string, unknown> = {}) => {
    const item: TrackItem = { name, data: { step: current, journey, ...context, ...data } }
    if (window.umami) {
      try { void Promise.resolve(window.umami.track(item.name, item.data)).catch(() => {}) } catch { /* never block the wizard */ }
    } else if (queue.length < 200) queue.push(item)
  }

  const clock = () => {
    const now = performance.now()
    if (!hidden) activeMs += Math.max(0, Math.min(now - lastTick, 15000, lastActivity + 60000 - lastTick))
    lastTick = now
  }
  const flush = () => {
    clock()
    if (activeMs >= 1) {
      event('step_time', { activeMs: Math.round(activeMs) })
      activeMs = 0
    }
  }

  window.demoTracking = {
    step(name, data = {}) {
      const next = name === 'question' ? `question:${data.goal}:${data.question}` : name
      if (next === current) return
      flush()
      current = next
      context = {}
      if (data.goal && GOALS.has(data.goal)) context.goal = data.goal
      if (Number.isInteger(data.question)) context.question = data.question
      event('step_view')
    },
    complete() { event('questionnaire_completed') },
    registered() { event('phone_registered') },
    journeyId() { return journey },
  }

  window.mydietBeforeSend = (type, payload) => {
    if (type !== 'event') return false
    const url = new URL(payload.url, location.origin)
    const safe = new URLSearchParams()
    for (const key of CAMPAIGN_KEYS) {
      const value = safeToken(url.searchParams.get(key) ?? attribution[key] ?? null)
      if (value) safe.set(key, value)
    }
    const goal = url.searchParams.get('goal')
    if (goal && GOALS.has(goal)) safe.set('goal', goal)
    const data: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(payload.data ?? {})) {
      if (key === 'step' && typeof value === 'string' && STEP.test(value)) data[key] = value
      if (key === 'journey' && typeof value === 'string' && /^[0-9a-f-]{36}$/.test(value)) data[key] = value
      if (key === 'goal' && typeof value === 'string' && GOALS.has(value)) data[key] = value
      if (key === 'question' && Number.isInteger(value) && Number(value) >= 0 && Number(value) < 1000) data[key] = value
      if (key === 'activeMs' && typeof value === 'number' && Number.isFinite(value)) data[key] = Math.max(0, Math.min(30000, value))
    }
    let referrer = ''
    try {
      const ref = new URL(payload.referrer ?? '')
      referrer = ref.origin === location.origin ? ref.origin + ref.pathname : ref.origin
    } catch { /* no referrer */ }
    return { ...payload, url: url.pathname + (safe.size ? '?' + safe : ''), referrer, title: 'My Diet Onboarding', data }
  }

  for (const type of ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const) {
    addEventListener(type, () => { lastActivity = performance.now() }, { passive: true })
  }
  const heartbeat = () => { if (!document.hidden) event('active_heartbeat') }
  window.setInterval(() => { flush(); heartbeat() }, 10000)
  heartbeat()
  document.addEventListener('visibilitychange', () => { if (document.hidden) event('presence_end'); else heartbeat() })
  addEventListener('pagehide', () => event('presence_end'))
  document.addEventListener('visibilitychange', () => {
    flush()
    hidden = document.hidden
    lastTick = performance.now()
    if (!hidden) lastActivity = lastTick
  })
  addEventListener('pagehide', flush)
  event('step_view')

  document.addEventListener('click', (clickEvent) => {
    const target = (clickEvent.target as Element | null)?.closest?.('button,a')
    if (!(target instanceof HTMLElement)) return
    const goal = target.dataset.trackingGoal
    if (goal) event('goal_selected', { goal })
    else if (target.id === 'letsGoBtn') event('start_clicked')
    else if (target.matches('[data-q-index],[data-field-submit],[data-detail-submit],[data-multi-submit],[data-skip-index]')) event('question_interacted')
    else if (['backToGoalsBtn', 'appLogoHomeBtn', 'scrollPrevAnsweredBtn'].includes(target.id)) event('back_clicked')
  }, true)

  const script = document.createElement('script')
  script.src = '/insights/script.js'
  script.defer = true
  script.dataset.websiteId = websiteId
  script.dataset.hostUrl = location.origin + '/insights'
  script.dataset.autoPageview = 'false'
  script.dataset.excludeHash = 'true'
  script.dataset.beforeSend = 'mydietBeforeSend'
  script.onload = () => {
    try { void Promise.resolve(window.umami?.track()).catch(() => {}) } catch { /* ignore */ }
    for (const item of queue.splice(0)) event(item.name, item.data)
  }
  script.onerror = () => { queue.length = 0 }
  document.head.append(script)
}

export const audience = {
  install: installAudienceTracking,
  step(name: string, data?: { goal?: string; question?: number }) {
    window.demoTracking?.step(name, data)
  },
  complete() { window.demoTracking?.complete() },
  registered() { window.demoTracking?.registered() },
  journeyId() { return window.demoTracking?.journeyId() ?? '' },
}
