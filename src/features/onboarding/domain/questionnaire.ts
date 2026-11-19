export interface SliderConfig {
  min: number
  max: number
  step: number
  default: number
  unit?: string
}

export interface QuizOption {
  label: string
  icon?: string
  image?: string
  pace?: string
}

export interface QuizQuestion {
  q: string
  type?: 'text' | 'number'
  ui?: string
  multi?: boolean
  options?: QuizOption[]
  placeholder?: string
  subtitle?: string
  category?: string
  originalNumber?: number
  metric?: string
  optional?: boolean
  followUpText?: boolean
  followUpLabel?: string
  followUpPlaceholder?: string
  followUpWhenLabel?: string | string[]
  medicalReviewWhenLabels?: string[]
  exclusiveLabels?: string[]
  slider?: SliderConfig
  heroImage?: string
}

export interface QuizGoal {
  id: string
  title: string
  desc: string
  badge?: string
  image?: string
  questions: QuizQuestion[]
}

export type AnswerValue =
  | string
  | number
  | { choice: number; detail?: string }
  | { choices: number[]; detail?: string }
  | { sleep: number; wake: number }

export function assetUrl(path?: string) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('/')) return path
  return '/onboarding/' + path.replace(/^\.\//, '')
}

function latinDigits(raw: string) {
  return String(raw)
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
}

export function iranianMobile(raw: string) {
  const digits = latinDigits(raw).replace(/\D/g, '')
  const phone = digits.length === 10 && digits.startsWith('9') ? '0' + digits : digits
  return /^09\d{9}$/.test(phone) ? phone : null
}

export function otpCode(raw: string) {
  const digits = latinDigits(raw).replace(/\D/g, '')
  return /^\d{6}$/.test(digits) ? digits : null
}

export function faDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)] ?? digit)
}

function enrichQuestion(question: QuizQuestion): QuizQuestion {
  if (question.multi && question.q === 'به چه غذاهایی حساسیت داری؟' && !question.exclusiveLabels?.length) {
    return { ...question, exclusiveLabels: ['بدون حساسیت'] }
  }
  return question
}

export function prepareQuestions(goal: QuizGoal) {
  let questions = goal.questions.map((question) => enrichQuestion({
    ...question,
    options: question.options?.map((option) => ({ ...option })),
  }))
  if (goal.id !== 'pregnancy') return questions
  questions = questions.filter((question) => ![3, 32].includes(question.originalNumber ?? -1))
  return questions.map((question) => {
    const number = question.originalNumber ?? -1
    if (![8, 10, 25, 26, 27].includes(number) || !question.options) return question
    const options = number === 25 && !question.options.some((option) => option.label === 'هیچ‌کدام')
      ? [...question.options, { label: 'هیچ‌کدام' }]
      : question.options
    return { ...question, multi: true, options }
  })
}

export function visibleQuestions(goalId: string, all: QuizQuestion[], answers: Record<number, AnswerValue | undefined>) {
  const exercise = answers[17]
  const noExercise = exercise === 0
  const stage = goalId === 'pregnancy' ? answers[20] : null
  return all.filter((question) => {
    const number = question.originalNumber ?? -1
    if (noExercise && (number === 18 || number === 19 || (goalId === 'weight_gain' && number === 25))) return false
    if (stage === 0 && question.category === 'سؤالات مخصوص شیردهی') return false
    if (stage === 1 && question.category === 'سؤالات مخصوص بارداری') return false
    return true
  })
}

export function answerOf(question: QuizQuestion, answers: Record<number, AnswerValue | undefined>) {
  return answers[question.originalNumber ?? -1]
}

function choiceIndex(answer: AnswerValue | undefined) {
  if (typeof answer === 'number') return answer
  if (answer && typeof answer === 'object' && 'choice' in answer) return answer.choice
  return undefined
}

export function followUpRequired(question: QuizQuestion, optionIndex: number | undefined) {
  if (!question.followUpText || optionIndex == null) return false
  const label = question.options?.[optionIndex]?.label
  if (question.followUpWhenLabel != null) {
    const targets = Array.isArray(question.followUpWhenLabel) ? question.followUpWhenLabel : [question.followUpWhenLabel]
    return targets.includes(label ?? '')
  }
  return label === 'بله'
}

export function needsMedicalReview(question: QuizQuestion, answer: AnswerValue | undefined) {
  const index = choiceIndex(answer)
  const label = index == null ? '' : question.options?.[index]?.label
  return (question.medicalReviewWhenLabels ?? []).includes(label ?? '')
}

export function isAnswered(question: QuizQuestion, answer: AnswerValue | undefined) {
  if (answer == null) return false
  if (question.multi) {
    if (!answer || typeof answer !== 'object' || !('choices' in answer) || answer.choices.length === 0) return false
    const needsDetail = answer.choices.some((index) => followUpRequired(question, index))
    return !needsDetail || String(answer.detail ?? '').trim() !== ''
  }
  if (question.ui === 'sleep-wake') {
    return typeof answer === 'object' && 'sleep' in answer && answer.sleep != null && answer.wake != null
  }
  if (question.type === 'text' || question.type === 'number') {
    return answer === '__skipped__' ? Boolean(question.optional) : String(answer).trim() !== ''
  }
  if (typeof answer === 'object' && 'choice' in answer) {
    return followUpRequired(question, answer.choice) ? String(answer.detail ?? '').trim() !== '' : true
  }
  return true
}

export function answerLabel(question: QuizQuestion, answer: AnswerValue | undefined) {
  if (answer == null) return 'ثبت نشده'
  if (question.ui === 'sleep-wake' && typeof answer === 'object' && 'sleep' in answer) {
    return `خواب ${faDigits(answer.sleep)} — بیداری ${faDigits(answer.wake)}`
  }
  if (question.type === 'text' || question.type === 'number') {
    return answer === '__skipped__' ? 'ثبت نشده (اختیاری)' : String(answer)
  }
  if (question.multi && typeof answer === 'object' && 'choices' in answer) {
    const labels = answer.choices.map((index) => question.options?.[index]?.label).filter(Boolean).join('، ')
    return answer.detail ? `${labels} — ${answer.detail}` : labels
  }
  if (typeof answer === 'object' && 'choice' in answer) {
    const base = question.options?.[answer.choice]?.label ?? ''
    return answer.detail ? `${base} — ${answer.detail}` : base
  }
  if (typeof answer === 'number') return question.options?.[answer]?.label || String(answer)
  return String(answer)
}

const LOSS_RATES: Record<string, number> = { slow: 0.25, balanced: 0.5, fast: 0.75, auto: 0.5 }

function numeric(value: unknown) {
  const latin = String(value ?? '')
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/٫/g, '.')
  return latin.trim() ? Number(latin) : Number.NaN
}

export function lossPaceText(pace: string | undefined, questions: QuizQuestion[], answers: Record<number, AnswerValue | undefined>) {
  if (!pace || !(pace in LOSS_RATES)) return ''
  const read = (predicate: (question: QuizQuestion) => boolean) => {
    const question = questions.find(predicate)
    return question ? answers[question.originalNumber ?? -1] : undefined
  }
  const weight = numeric(read((question) => question.metric === 'current-weight'))
  const target = numeric(read((question) => question.metric === 'target-loss'))
  const height = numeric(read((question) => question.originalNumber === 4))
  const rate = LOSS_RATES[pace] ?? 0
  if (!Number.isFinite(weight) || !Number.isFinite(target) || weight <= 0 || target <= 0 || target >= weight) {
    return 'زمان مناسب پس از بررسی قد، وزن و وزن هدف مشخص می‌شود'
  }
  if (Number.isFinite(height) && height > 0 && target / (height / 100) ** 2 < 18.5) {
    return 'زمان مناسب پس از بررسی قد، وزن و وزن هدف مشخص می‌شود'
  }
  const weekly = Math.min(rate, weight * 0.01)
  const months = (weight - target) / weekly / (365.25 / 12 / 7)
  const min = Math.floor(months)
  const max = Math.ceil(months)
  const format = (value: number) => value.toLocaleString('fa-IR', { maximumFractionDigits: 2 })
  const duration = max <= 1 ? 'حدود ۱ ماه یا کمتر' : min === max ? `حدود ${format(max)} ماه` : `حدود ${format(min)} تا ${format(max)} ماه`
  return `${duration} · با سرعت اولیهٔ حدود ${format(weekly)} کیلوگرم در هفته`
}

export const specialists = [
  { id: 'sara', name: 'دکتر سارا محمدی', focus: 'کاهش وزن پایدار', sprite: 0 },
  { id: 'amir', name: 'دکتر امیر حسینی', focus: 'متابولیسم و تغذیه', sprite: 1 },
  { id: 'nazanin', name: 'دکتر نازنین کریمی', focus: 'افزایش وزن سالم', sprite: 2 },
  { id: 'reza', name: 'دکتر رضا احمدی', focus: 'عضله‌سازی و انرژی', sprite: 3 },
  { id: 'maryam', name: 'دکتر مریم نوری', focus: 'تغذیه بارداری', sprite: 4 },
  { id: 'elham', name: 'دکتر الهام صادقی', focus: 'تغذیه شیردهی', sprite: 5 },
  { id: 'parsa', name: 'دکتر پارسا کیانی', focus: 'تغذیه و سلامت گوارش', sprite: 6 },
  { id: 'hanieh', name: 'دکتر هانیه مرادی', focus: 'تغذیه متعادل', sprite: 7 },
  { id: 'niloofar', name: 'دکتر نیلوفر فرهمند', focus: 'اصلاح عادت‌های غذایی', sprite: 8 },
  { id: 'kian', name: 'دکتر کیان شریفی', focus: 'تغذیه ورزشی', sprite: 9 },
]

export function sampleSpecialists() {
  const first = Math.floor(Math.random() * specialists.length)
  let second = Math.floor(Math.random() * (specialists.length - 1))
  if (second >= first) second += 1
  return [specialists[first], specialists[second]].filter((person): person is (typeof specialists)[number] => Boolean(person))
}

export const plans = [
  {
    id: 'weekly',
    title: 'شروع',
    days: '۱۵ روزه',
    price: '۱٬۲۹۰٬۰۰۰',
    description: 'یک شروع مشخص، متناسب با تو',
    features: [
      'برنامه تغذیه اختصاصی با {doctor}',
      'جایگزین‌های غذایی متناسب با سلیقه‌ات',
      'لیست خرید برنامه',
    ],
  },
  {
    id: 'monthly',
    title: 'همراه',
    days: '۳۰ روزه',
    price: '۱٬۹۹۰٬۰۰۰',
    description: 'زمان بیشتر، همراهی نزدیک‌تر',
    features: [
      'همه امکانات پلن شروع با {doctor}',
      '۲ نوبت بازبینی و اصلاح برنامه',
      'پیگیری هفتگی روند و اجرای برنامه',
      'پشتیبانی متنی در طول دوره',
    ],
  },
  {
    id: 'quarterly',
    title: 'VIP',
    days: '۹۰ روزه',
    price: '۸٬۹۹۰٬۰۰۰',
    description: 'همراهی خصوصی و پیوسته',
    features: [
      'برنامه اختصاصی و همراهی {doctor}',
      '۶ نوبت بازبینی و اصلاح برنامه',
      '۳ جلسه آنلاین با متخصص منتخب',
      'پیگیری هفتگی و پشتیبانی اولویت‌دار',
      'برنامه حفظ عادت‌ها در پایان دوره',
    ],
  },
] as const

export type PlanId = (typeof plans)[number]['id']

export function isHeightQuestion(question: QuizQuestion) {
  const subtitle = (question.subtitle ?? '').trim()
  return subtitle.includes('سانتی') || question.q.includes('قدت')
}

export function isWeightQuestion(question: QuizQuestion) {
  if (isHeightQuestion(question)) return false
  const subtitle = (question.subtitle ?? '').trim()
  if (subtitle.includes('هفته') || question.q.includes('هفته')) return false
  if (subtitle.includes('ماه') || question.q.includes('ماه')) return false
  if (subtitle.includes('سال') || question.q.includes('سال')) return false
  return subtitle.includes('کیلو') || question.q.includes('وزن')
}

export function metricConfig(question: QuizQuestion, answers: Record<number, AnswerValue | undefined>, questions: QuizQuestion[]) {
  if (question.slider) return question.slider
  const subtitle = (question.subtitle ?? '').trim()
  const weightQuestion = questions.find((item) => item.metric === 'current-weight')
  const weight = weightQuestion ? numeric(answers[weightQuestion.originalNumber ?? -1]) : Number.NaN
  if (subtitle.includes('کیلو') || question.q.includes('وزن')) {
    return {
      min: question.metric === 'target-gain' && Number.isFinite(weight) ? weight : 35,
      max: question.metric === 'target-loss' && Number.isFinite(weight) ? weight - 1 : question.metric === 'target-gain' ? 300 : 240,
      step: 1,
      default: question.metric === 'target-gain' && Number.isFinite(weight) ? weight : 68,
      unit: 'کیلوگرم',
    }
  }
  if (isHeightQuestion(question)) return { min: 120, max: 230, step: 1, default: 165, unit: 'سانتی‌متر' }
  if (question.q.includes('سال')) return { min: 15, max: 90, step: 1, default: 28, unit: 'سال' }
  if (subtitle.includes('هفته') || question.q.includes('هفته')) return { min: 4, max: 42, step: 1, default: 12, unit: 'هفته' }
  if (question.q.includes('ماه') || subtitle.includes('ماه')) return { min: 0, max: 24, step: 1, default: 4, unit: 'ماه' }
  return { min: 0, max: 100, step: 1, default: 50, unit: subtitle || 'عدد' }
}

export function bmiGuidance(height: unknown, weight: unknown, goalId: string) {
  const centimeters = numeric(height)
  const kilograms = numeric(weight)
  if (goalId === 'pregnancy' || !Number.isFinite(centimeters) || !Number.isFinite(kilograms) || centimeters <= 0 || kilograms <= 0) return null
  const squared = (centimeters / 100) ** 2
  const bmi = kilograms / squared
  return {
    bmi,
    weight: kilograms,
    low: Math.ceil(18.5 * squared * 10) / 10,
    high: Math.floor(24.9 * squared * 10) / 10,
    category: bmi < 18.5 ? 'کمبود وزن' : bmi < 25 ? 'محدودهٔ سالم' : bmi < 30 ? 'اضافه‌وزن' : 'چاقی',
    suggestGain: goalId === 'weight_loss' && bmi < 18.5,
  }
}
