import { useEffect, useState } from 'react'
import { faDigits } from '../../../domain/questionnaire'
import { BrandLogo } from '@shared/ui/BrandLogo'

export function PreparingStage({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const phases = ['شناخت هدف و شرایط تو', 'بررسی عادت‌های غذایی', 'آماده‌سازی پیشنهاد متخصص']
  const phase = Math.min(2, Math.floor(progress / 34))

  useEffect(() => {
    const started = performance.now()
    const timer = window.setInterval(() => {
      setProgress(Math.min(100, Math.floor((performance.now() - started) / 80)))
    }, 80)
    const done = window.setTimeout(onDone, 8000)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(done)
    }
  }, [onDone])

  return (
    <div id="aiPreparingPhase" className="ai-prep-phase">
      <div className="analysis-visual" aria-hidden="true">
        <span className="analysis-orbit analysis-orbit--outer"><span className="analysis-ring ring-outer" /></span>
        <span className="analysis-orbit analysis-orbit--inner"><span className="analysis-ring ring-inner" /></span>
        <span className="analysis-spark spark-outer">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.2 13.7 8.8 21.6 12 13.7 15.2 12 22.8 10.3 15.2 2.4 12 10.3 8.8Z" /></svg>
        </span>
        <span className="analysis-spark analysis-spark--sm spark-inner">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.2 13.7 8.8 21.6 12 13.7 15.2 12 22.8 10.3 15.2 2.4 12 10.3 8.8Z" /></svg>
        </span>
        <span className="analysis-core"><BrandLogo variant="symbol" size={58} decorative /></span>
      </div>
      <h2 className="ai-prep-title">اطلاعات شما<br />در حال آنالیز است</h2>
      <p id="analysisPercent">{faDigits(progress)}٪</p>
      <p id="analysisStatus">{phases[phase] ?? phases[2]}</p>
      <div className="analysis-steps">
        {phases.map((label, index) => (
          <span key={label} className={index === phase ? 'is-active' : index < phase ? 'is-done' : undefined}>{label}</span>
        ))}
      </div>
      <div className="ai-prep-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="پیشرفت آنالیز">
        <div id="aiPrepProgressFill" className="ai-prep-progress-fill" style={{ width: progress + '%' }} />
      </div>
      <p className="analysis-wait-hint">صبر کنید</p>
    </div>
  )
}
