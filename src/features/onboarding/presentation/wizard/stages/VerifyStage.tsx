import { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWizard } from '../../../application/wizard-store'
import { answerLabel, answerOf, faDigits, iranianMobile, otpCode, plans } from '../../../domain/questionnaire'
import { audience, canonicalAnswer, onboarding, writeCheckoutSession } from '../../../composition'

const OTP_LENGTH = 6

function latinOtp(raw: string) {
  return raw
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\D/g, '')
    .slice(0, OTP_LENGTH)
}

function OtpCellField({
  value,
  onChange,
  disabled,
  success,
  shake,
}: {
  value: string
  onChange: (next: string) => void
  disabled?: boolean
  success?: boolean
  shake?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const digits = latinOtp(value)
  const cells = Array.from({ length: OTP_LENGTH }, (_, index) => digits[index] ?? '')

  useEffect(() => {
    if (!success && !disabled) inputRef.current?.focus()
  }, [success, disabled])

  return (
    <div
      dir="ltr"
      className={'otp-morph otp-cells-field' + (success ? ' is-success' : '') + (shake ? ' shake-error' : '')}
      onClick={() => !success && inputRef.current?.focus()}
    >
      <div className="otp-cells" dir="ltr" aria-hidden={success}>
        {cells.map((digit, index) => {
          const active = !success && (index === digits.length || (digits.length === OTP_LENGTH && index === OTP_LENGTH - 1))
          return (
            <span key={index} className={'otp-cell' + (digit ? ' is-filled' : '') + (active ? ' is-active' : '')}>
              {digit ? faDigits(digit) : ''}
            </span>
          )
        })}
      </div>
      <input
        ref={inputRef}
        id="morphOtpInput"
        dir="ltr"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        className="otp-cells-input"
        value={digits}
        disabled={disabled || success}
        onChange={(event) => onChange(latinOtp(event.target.value))}
        onPaste={(event) => {
          event.preventDefault()
          onChange(latinOtp(event.clipboardData.getData('text')))
        }}
        aria-label="کد تأیید شش‌رقمی"
      />
      <span className="otp-morph-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
        </svg>
      </span>
    </div>
  )
}

export function VerifyStage() {
  const navigate = useNavigate()
  const wizard = useWizard()
  const [mode, setMode] = useState<'phone' | 'otp'>(wizard.contactMode)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [otpShake, setOtpShake] = useState(false)
  const plan = plans.find((item) => item.id === wizard.plan) ?? plans[1]

  useEffect(() => {
    if (useWizard.getState().contactMode !== mode) useWizard.getState().setContactMode(mode)
    audience.step(mode === 'otp' ? 'otp' : 'contact')
  }, [mode])

  async function sendPhone(event: FormEvent) {
    event.preventDefault()
    if (!wizard.goal) return
    const phone = iranianMobile(wizard.phone)
    if (!phone) {
      setError('لطفاً یک شماره موبایل معتبر ۱۱ رقمی (شروع با ۰۹) وارد کنید.')
      return
    }
    setBusy(true)
    setError('')
    try {
      wizard.resetSubmission(phone)
      const state = useWizard.getState()
      const answers = state.questions.map((item) => {
        const value = answerOf(item, state.answers)
        return { question: item.q, answer: answerLabel(item, value), ...canonicalAnswer(item, value) }
      })
      await onboarding.requestSms({
        phone,
        submissionId: state.submissionId,
        goalId: state.goal?.id,
        specialistId: state.specialistId,
        answers,
      })
      audience.registered()
      wizard.setPhone(phone)
      setMode('otp')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ارسال کد انجام نشد.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault()
    const value = otpCode(code)
    if (!value) {
      setError('کد شش‌رقمی پیامک‌شده را وارد کنید.')
      setOtpShake(true)
      window.setTimeout(() => setOtpShake(false), 450)
      return
    }
    setBusy(true)
    setError('')
    try {
      const token = await onboarding.confirmSms({
        phone: wizard.phone,
        code: value,
        submissionId: wizard.submissionId,
        journeyId: audience.journeyId(),
      })
      wizard.setToken(token)
      writeCheckoutSession({ token, submissionId: wizard.submissionId, plan: wizard.plan })
      setOtpSuccess(true)
      await new Promise((resolve) => window.setTimeout(resolve, 920))
      wizard.setStage('checkout')
      navigate('/onboarding/payment')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تأیید شماره ذخیره نشد.')
      setOtpShake(true)
      window.setTimeout(() => setOtpShake(false), 450)
      setBusy(false)
    }
  }

  return (
    <div id="twoStepModalBackdrop" className="flex">
      <div id="twoStepModalCard" data-plan={wizard.plan} data-verification={otpSuccess ? 'success' : undefined}>
        <div className="modal-topbar verify-topbar">
          <button
            id="modalBackToPlansBtn"
            type="button"
            className="modal-back-plans-btn verify-back-btn"
            onClick={() => wizard.setStage('plans')}
          >
            بازگشت به پلن‌ها
          </button>
          <span id="modalHeaderTitle">تأیید شماره</span>
        </div>
        <div className="modal-scroll-body">
          <form id="modalStep2Content" className="verify-flow" onSubmit={mode === 'phone' ? sendPhone : verifyCode}>
            <div className="verify-hero" aria-hidden="true">
              <span className={`verify-hero-badge${mode === 'otp' ? ' verify-hero-badge--otp' : ''}`}>
                {mode === 'phone' ? (
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
                    <path d="M11 18.5h2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </div>
            <div id="morphingInputWrapper" className="input-morph-shell verify-input-shell">
              <label id="morphInputLabel" htmlFor={mode === 'phone' ? 'morphPhoneInput' : 'morphOtpInput'}>
                <span id="morphInputLabelText">{mode === 'phone' ? 'شماره همراهت' : 'کد تأیید پیامکی'}</span>
              </label>
              <p id="morphInputSubtitle">
                {mode === 'phone'
                  ? 'برای ذخیرهٔ پاسخ‌ها و ادامهٔ خرید، یک‌بار کد تأیید برایت می‌فرستیم.'
                  : `کد شش‌رقمی به ${faDigits(wizard.phone)} ارسال شد.`}
              </p>
              {mode === 'phone' ? (
                <input
                  id="morphPhoneInput"
                  className="verify-phone-input"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={11}
                  placeholder="09123456789"
                  value={wizard.phone}
                  onChange={(event) => wizard.setPhone(event.target.value)}
                />
              ) : (
                <OtpCellField
                  value={code}
                  onChange={setCode}
                  disabled={busy}
                  success={otpSuccess}
                  shake={otpShake}
                />
              )}
              {error && <p id="morphErrorText">{error}</p>}
              <button id="morphConfirmBtn" type="submit" className="w-full" disabled={busy || otpSuccess}>
                <span id="morphConfirmBtnText">
                  {otpSuccess ? 'تأیید شد' : busy ? 'در حال ارسال…' : mode === 'phone' ? 'دریافت کد تأیید' : 'تأیید و ادامه به پرداخت'}
                </span>
              </button>
              {mode === 'phone' && <p className="verify-privacy-note">شمارهٔ تو فقط برای ذخیرهٔ پرونده و پشتیبانی استفاده می‌شود.</p>}
              {mode === 'otp' && (
                <button id="editPhoneInOtpModeBtn" type="button" disabled={otpSuccess} onClick={() => { setMode('phone'); setCode(''); setError(''); setOtpSuccess(false) }}>
                  ویرایش شماره
                </button>
              )}
            </div>
            <div className="modal-plan-line verify-plan-pill">
              <p className="modal-plan-summary-inline">
                <strong>{plan.title}</strong>
                <span className="modal-plan-sep">·</span>
                <span>{plan.days}</span>
                <span className="modal-plan-sep">·</span>
                <span id="step2PlanPrice">{plan.price} تومان</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}