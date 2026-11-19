export class StaffError extends Error {
  status: number

  constructor(message: string, status = 0) {
    super(message)
    this.name = 'StaffError'
    this.status = status
  }
}

export type StaffRole = 'admin' | 'specialist'

export interface StaffSessionPayload {
  role?: string
  accessToken?: string
  sessionExpiresAt?: string
  totpRequired?: boolean
  totpToken?: string
}

export interface StaffSession {
  api: <T = unknown>(path: string, method?: string, body?: unknown, headers?: Record<string, string>) => Promise<T>
  login: <T = StaffSessionPayload>(path: string, body?: unknown) => Promise<T>
  accept: (session: StaffSessionPayload) => StaffSessionPayload
  restore: () => Promise<StaffSessionPayload>
  logout: () => Promise<void>
  clear: () => void
  readonly active: boolean
  readonly actorId: string | null
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const data: unknown = await response.json()
    if (data && typeof data === 'object') return data as Record<string, unknown>
  } catch {
    /* empty or HTML error pages */
  }
  return {}
}

function messageFrom(body: Record<string, unknown>, fallback: string) {
  const messageFa = body.messageFa
  const detail = body.detail
  const message = body.message
  if (typeof messageFa === 'string' && messageFa.trim()) return messageFa.trim()
  if (typeof detail === 'string' && /[\u0600-\u06FF]/.test(detail)) return detail.trim()
  if (typeof message === 'string' && /[\u0600-\u06FF]/.test(message)) return message.trim()
  return fallback
}

export function createStaffSession(role: StaffRole, onExpired: () => void = () => {}): StaffSession {
  let token: string | null = null
  let actorId: string | null = null
  let expiresAt = 0
  let refreshing: Promise<StaffSessionPayload> | null = null

  const request = async <T>(path: string, method = 'GET', body?: unknown, withAuth = true, headers?: Record<string, string>): Promise<T> => {
    const controller = new AbortController()
    const isAiTest = method === 'POST' && /^admin\/ai\/(?:providers|pools|prompts)\/[^/]+\/test$/.test(path)
    const isAiCatalog = method === 'GET' && /^admin\/ai\/providers\/[^/]+\/models(?:\?.*)?$/.test(path)
    const waitMs = isAiTest ? 75000 : isAiCatalog ? 90000 : 15000
    const timer = setTimeout(() => controller.abort(), waitMs)
    try {
      const response = await fetch('/v1/' + path, {
        method,
        credentials: 'same-origin',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-sabzine-client': 'web',
          ...(withAuth && token ? { Authorization: 'Bearer ' + token } : {}),
          ...headers,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      })
      const data = await readBody(response)
      if (!response.ok) {
        throw new StaffError(messageFrom(data, 'دریافت اطلاعات انجام نشد.'), response.status)
      }
      return data as T
    } catch (error) {
      if (error instanceof StaffError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new StaffError('پاسخ سرور به‌موقع نرسید.', 408)
      }
      throw new StaffError('ارتباط برقرار نیست.', 0)
    } finally {
      clearTimeout(timer)
    }
  }

  const clear = () => {
    token = null
    actorId = null
    expiresAt = 0
  }

  const accept = (session: StaffSessionPayload) => {
    if (session.role !== role) {
      clear()
      throw new StaffError('این حساب اجازه ورود به این پنل را ندارد.', 403)
    }
    const expiry = Date.parse(session.sessionExpiresAt ?? '')
    if (!session.accessToken || !Number.isFinite(expiry) || expiry <= Date.now()) {
      clear()
      throw new StaffError('نشست منقضی شده؛ دوباره وارد شوید.', 401)
    }
    token = session.accessToken
    try {
      const payload = token.split('.')[1] ?? ''
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      const parsed: unknown = JSON.parse(json)
      actorId =
        parsed && typeof parsed === 'object' && 'sub' in parsed && typeof parsed.sub === 'string'
          ? parsed.sub
          : null
    } catch {
      actorId = null
    }
    expiresAt = expiry
    return session
  }

  const restore = () => {
    refreshing ||= request<StaffSessionPayload>('auth/refresh', 'POST', {})
      .then(accept)
      .finally(() => {
        refreshing = null
      })
    return refreshing
  }

  const api = async <T>(path: string, method = 'GET', body?: unknown, headers?: Record<string, string>): Promise<T> => {
    if (!token || Date.now() >= expiresAt) {
      clear()
      onExpired()
      throw new StaffError('برای ادامه وارد حساب شوید.', 401)
    }
    try {
      return await request<T>(path, method, body, true, headers)
    } catch (error) {
      if (!(error instanceof StaffError) || error.status !== 401) throw error
      try {
        await restore()
      } catch (failure) {
        if (failure instanceof StaffError && (failure.status === 401 || failure.status === 403)) {
          clear()
          onExpired()
        }
        throw failure
      }
      try {
        return await request<T>(path, method, body, true, headers)
      } catch (failure) {
        if (failure instanceof StaffError && failure.status === 401) {
          clear()
          onExpired()
        }
        throw failure
      }
    }
  }

  return {
    api,
    login: (path, body) => request(path, 'POST', body, false),
    accept,
    restore,
    async logout() {
      await api('auth/logout', 'POST')
      clear()
    },
    clear,
    get active() {
      return !!token && Date.now() < expiresAt
    },
    get actorId() {
      return actorId
    },
  }
}

export async function publicRequest<T>(path: string, method = 'GET', body?: unknown, token?: string): Promise<T> {
  const response = await fetch('/v1/' + path, {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-sabzine-client': 'web',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15000),
  })
  const data = await readBody(response)
  if (!response.ok) throw new StaffError(messageFrom(data, 'دریافت اطلاعات انجام نشد.'), response.status)
  return data as T
}
