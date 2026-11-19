import { assetUrl } from '../../../domain/questionnaire'

const features = [
  ['intro-specialist.jpg', 'نظارت متخصص'],
  ['intro-ai.jpg', 'رژیم هوشمند'],
  ['intro-support.jpg', 'پشتیبانی همراه'],
  ['intro-plans.jpg', 'پلن‌های متنوع'],
] as const

export function IntroStage({ onStart }: { onStart: () => void }) {
  return (
    <div id="sloganStage" className="w-full max-w-2xl mx-auto text-center">
      <h1 id="sloganHeading" className="hero-title flex flex-wrap items-center justify-center">
        <span className="slogan-word revealed">رژیم</span>
        <span className="slogan-word revealed slogan-highlight">اختصاصی</span>
        <span className="slogan-line-break" aria-hidden="true" />
        <span className="slogan-word revealed">خودتو</span>
        <span className="slogan-word revealed slogan-highlight">بساز!</span>
      </h1>
      <div id="heroFeatureStrip" className="grid grid-cols-2 sm:grid-cols-4">
        {features.map(([file, label]) => (
          <div key={label} className="hero-feature-card">
            <img className="hero-feature-photo" src={assetUrl('assets/' + file)} alt="" width={840} height={560} />
            <span className="hero-feature-text">{label}</span>
          </div>
        ))}
      </div>
      <div id="letsGoBtnWrapper" className="w-full flex flex-col items-center gap-3">
        <button id="letsGoBtn" type="button" className="w-full" onClick={onStart}>
          <span>بزن بریم</span>
        </button>
      </div>
    </div>
  )
}
