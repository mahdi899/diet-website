import { useEffect, useMemo, useRef, useState } from 'react'
import { questionnaireGoals } from '../../composition'
import { bmiGuidance, faDigits, type AnswerValue, type QuizQuestion } from '../../domain/questionnaire'
import { useWizard } from '../../application/wizard-store'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function HeightRuler({
  min,
  max,
  value,
  onChange,
  onContinue,
}: {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  onContinue: () => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const fromScroll = useRef(false)
  const ticks = useMemo(() => Array.from({ length: max - min + 1 }, (_, index) => min + index), [min, max])

  useEffect(() => {
    const element = scroller.current
    const tick = element?.querySelector<HTMLElement>('.height-ruler-tick')
    if (!element || !tick || fromScroll.current) {
      fromScroll.current = false
      return
    }
    element.scrollTop = (value - min) * tick.offsetHeight
  }, [value, min])

  function read(element: HTMLDivElement) {
    const tick = element.querySelector<HTMLElement>('.height-ruler-tick')
    if (!tick?.offsetHeight) return value
    return clamp(min + Math.round(element.scrollTop / tick.offsetHeight), min, max)
  }

  return (
    <div className="metric-slider-card height-ruler-card">
      <div className="height-ruler" data-min={min} data-max={max} data-value={value}>
        <div className="height-ruler-scale">
          <div
            ref={scroller}
            className="height-ruler-scroller"
            tabIndex={0}
            role="slider"
            aria-label="قد به سانتی‌متر"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={`${faDigits(value)} سانتی‌متر`}
            aria-orientation="vertical"
            onScroll={(event) => {
              const next = read(event.currentTarget)
              if (next === value) return
              fromScroll.current = true
              onChange(next)
            }}
            onKeyDown={(event) => {
              const next = event.key === 'ArrowDown' || event.key === 'ArrowLeft' ? value + 1
                : event.key === 'ArrowUp' || event.key === 'ArrowRight' ? value - 1
                  : event.key === 'PageDown' ? value + 5
                    : event.key === 'PageUp' ? value - 5
                      : event.key === 'Home' ? min
                        : event.key === 'End' ? max
                          : null
              if (next == null) return
              event.preventDefault()
              onChange(clamp(next, min, max))
            }}
          >
            <div className="height-ruler-pad" aria-hidden="true" />
            {ticks.map((centimeter) => (
              <div key={centimeter} className={'height-ruler-tick' + (centimeter % 5 === 0 ? ' height-ruler-tick--major' : '') + (centimeter === value ? ' is-active' : '')} dir="ltr" data-cm={centimeter}>
                <span className="height-ruler-mark" />
                <span className="height-ruler-num" dir="ltr">{faDigits(centimeter)}</span>
              </div>
            ))}
            <div className="height-ruler-pad" aria-hidden="true" />
          </div>
          <div className="height-ruler-indicator" aria-hidden="true" />
        </div>
        <div className="height-ruler-readout">
          <span className="height-ruler-value">{faDigits(value)}</span>
          <span className="height-ruler-unit">سانتی‌متر</span>
        </div>
      </div>
      <button type="button" data-field-submit="" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-4" onClick={onContinue}>ثبت و ادامه</button>
    </div>
  )
}

const gauge = { vbW: 340, vbH: 154, cx: 170, cy: 304, rArc: 256, rTick: 256, rLabel: 204, degPerKg: 1.6, needle: -90, arc0: -126, arc1: -54 }

function polar(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180
  return { x: gauge.cx + radius * Math.cos(rad), y: gauge.cy + radius * Math.sin(rad) }
}

export function WeightGauge({
  min,
  max,
  value,
  onChange,
  onContinue,
}: {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  onContinue: () => void
}) {
  const svg = useRef<SVGSVGElement>(null)
  const drag = useRef<{ x: number; value: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const safeMin = Math.min(min, max)
  const safeMax = Math.max(min, max)
  const shown = clamp(Math.round(value), safeMin, safeMax)

  const arc = useMemo(() => {
    let path = ''
    for (let step = 0; step <= 42; step += 1) {
      const deg = gauge.arc0 + ((gauge.arc1 - gauge.arc0) * step) / 42
      const point = polar(deg, gauge.rArc)
      path += `${step ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    }
    return path
  }, [])

  const marks = useMemo(() => {
    const items: { kg: number; line?: { x1: number; y1: number; x2: number; y2: number }; label?: { x: number; y: number }; major: boolean; fifth: boolean }[] = []
    for (let kg = safeMin; kg <= safeMax; kg += 1) {
      const deg = gauge.needle + (kg - shown) * gauge.degPerKg
      const dist = Math.min(deg - gauge.arc0, gauge.arc1 - deg)
      if (dist < 5) continue
      const len = kg % 10 === 0 ? 16 : kg % 5 === 0 ? 11 : 6
      const outer = polar(deg, gauge.rTick)
      const inner = polar(deg, gauge.rTick - len)
      const label = kg % 10 === 0 ? polar(deg, gauge.rLabel) : undefined
      items.push({
        kg,
        major: kg % 10 === 0,
        fifth: kg % 5 === 0,
        line: { x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y },
        label: label ? { x: label.x, y: label.y } : undefined,
      })
    }
    return items
  }, [safeMin, safeMax, shown])

  function move(clientX: number) {
    const start = drag.current
    const box = svg.current?.getBoundingClientRect()
    if (!start || !box || box.width <= 0) return
    const step = gauge.rTick * (box.width / gauge.vbW) * (gauge.degPerKg * Math.PI / 180)
    onChange(clamp(start.value - (clientX - start.x) / step, safeMin, safeMax))
  }

  if (safeMin > safeMax || !Number.isFinite(safeMin)) {
    return <p>با وزن فعلی، در بازهٔ این پرسش‌نامه وزن هدف قابل انتخاب نیست.</p>
  }

  return (
    <div className="metric-slider-card weight-gauge-card">
      <div
        className={'weight-gauge' + (dragging ? ' is-dragging' : '')}
        dir="ltr"
        role="slider"
        tabIndex={0}
        aria-label="وزن به کیلوگرم"
        aria-valuemin={safeMin}
        aria-valuemax={safeMax}
        aria-valuenow={shown}
        aria-valuetext={`${faDigits(shown)} کیلوگرم`}
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, value: shown }
          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => { if (drag.current) move(event.clientX) }}
        onPointerUp={() => { drag.current = null; setDragging(false); onChange(shown) }}
        onKeyDown={(event) => {
          const next = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? shown + 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? shown - 1 : null
          if (next == null) return
          event.preventDefault()
          onChange(clamp(next, safeMin, safeMax))
        }}
      >
        <div className="weight-gauge-stage" dir="ltr">
          <svg ref={svg} className="weight-gauge-svg" viewBox={`0 0 ${gauge.vbW} ${gauge.vbH}`} aria-hidden="true">
            <path className="weight-gauge-arc" d={arc} />
            <g className="weight-gauge-ticks">
              {marks.map((mark) => mark.line && (
                <line
                  key={mark.kg}
                  className={'weight-gauge-tick' + (mark.major ? ' weight-gauge-tick--10' : mark.fifth ? ' weight-gauge-tick--5' : '') + (mark.kg === shown ? ' is-current' : '')}
                  x1={mark.line.x1}
                  y1={mark.line.y1}
                  x2={mark.line.x2}
                  y2={mark.line.y2}
                />
              ))}
              {marks.map((mark) => mark.label && (
                <text key={'l' + mark.kg} className={'weight-gauge-label' + (mark.kg === shown ? ' is-current' : '')} x={mark.label.x} y={mark.label.y} textAnchor="middle" dominantBaseline="central">
                  {faDigits(mark.kg)}
                </text>
              ))}
            </g>
            <polygon className="weight-gauge-needle" points={`${gauge.cx},56 ${gauge.cx - 5.5},18 ${gauge.cx + 5.5},18`} />
          </svg>
        </div>
        <div className="weight-gauge-readout" dir="rtl">
          <span className="weight-gauge-value">{faDigits(shown)}</span>
          <span className="weight-gauge-unit">کیلوگرم</span>
        </div>
      </div>
      <button type="button" data-field-submit="" className="quiz-green-btn w-full py-3 rounded-xl font-bold text-sm mt-4" onClick={onContinue}>ثبت و ادامه</button>
    </div>
  )
}

export function WeightGuidance({ question, questions, answers, value }: {
  question: QuizQuestion
  questions: QuizQuestion[]
  answers: Record<number, AnswerValue | undefined>
  value: number
}) {
  const goal = useWizard((state) => state.goal)
  const replaceGoal = useWizard((state) => state.replaceGoal)
  const stored = useWizard((state) => state.answers)
  if (!goal || goal.id === 'pregnancy') return null
  if (question.metric !== 'current-weight' && !question.metric?.startsWith('target-')) return null
  const height = questions.find((item) => item.originalNumber === 4)
  const current = questions.find((item) => item.metric === 'current-weight')
  const heightValue = height ? answers[height.originalNumber ?? -1] : undefined
  const weightValue = question.metric === 'current-weight' ? value : current ? answers[current.originalNumber ?? -1] : undefined
  const guide = bmiGuidance(heightValue, weightValue, goal.id)
  if (!guide) return null
  const format = (amount: number) => amount.toLocaleString('fa-IR', { maximumFractionDigits: 1 })
  return (
    <section className="weight-guidance" aria-label="شاخص تودهٔ بدنی و بازهٔ وزن سالم">
      <div className="weight-guidance-heading"><strong>BMI شما: {format(guide.bmi)}</strong><span>{guide.category}</span></div>
      <p>بازهٔ تقریبی وزن سالم برای قد شما: <strong>{format(guide.low)} تا {format(guide.high)} کیلوگرم</strong></p>
      {question.metric !== 'current-weight' && <p>وزن فعلی شما: {format(guide.weight)} کیلوگرم.{goal.id === 'weight_gain' ? ' برای افزایش وزن، هدفی بالاتر از وزن فعلی انتخاب کن.' : ''}</p>}
      {guide.suggestGain && (
        <div className="weight-guidance-suggestion">
          <p>BMI شما در محدودهٔ کمبود وزن است. پیشنهاد ما تغییر هدف به افزایش وزن و بررسی وزن هدف با متخصص است.</p>
          <button
            type="button"
            className="quiz-green-btn"
            onClick={() => {
              const next = questionnaireGoals().find((item) => item.id === 'weight_gain')
              if (!next) return
              const kept = { ...stored }
              if (current?.originalNumber) kept[current.originalNumber] = String(guide.weight)
              replaceGoal(next, kept)
            }}
          >
            تغییر هدف به افزایش وزن
          </button>
        </div>
      )}
      <small>این بازه برآورد عمومی برای بزرگسالان است، نه وزن هدف قطعی.</small>
    </section>
  )
}
