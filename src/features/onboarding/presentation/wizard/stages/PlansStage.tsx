import { useState } from 'react'
import { plans, specialists, type PlanId } from '../../../domain/questionnaire'
import { useWizard } from '../../../application/wizard-store'

function Feature({ text, doctor }: { text: string; doctor: string }) {
  const [before, after] = text.split('{doctor}')
  return (
    <li>
      {before}
      {after != null && <span className="plan-doctor-name">{doctor}</span>}
      {after}
    </li>
  )
}

export function PlansStage({ onBuy }: { onBuy: () => void }) {
  const plan = useWizard((state) => state.plan)
  const setPlan = useWizard((state) => state.setPlan)
  const specialistId = useWizard((state) => state.specialistId)
  const [open, setOpen] = useState<PlanId>(plan)
  const doctor = specialists.find((person) => person.id === specialistId)?.name ?? 'متخصص منتخب شما'
  const selected = plans.find((item) => item.id === plan)

  return (
    <div id="twoStepModalBackdrop" className="flex">
      <div id="twoStepModalCard" data-plan={plan}>
        <div className="modal-topbar"><span id="modalHeaderTitle">انتخاب نوع برنامه</span></div>
        <div className="modal-scroll-body">
          <div id="modalStep1Content">
            <div className="plans-intro">
              <h2>یک قدم تا شروع مسیرت</h2>
              <p>جزئیات هر پلن را ببین و همان را بخر.</p>
            </div>
            <div className="plans-stack">
              {plans.map((item) => {
                const expanded = open === item.id
                return (
                  <section key={item.id} className={'plan-tier' + (expanded ? ' is-open' : '')} data-tier={item.id}>
                    {item.id === 'monthly' && <span className="plan-recommendation">پیشنهاد ما</span>}
                    <button
                      type="button"
                      className="plan-option-card"
                      aria-expanded={expanded}
                      aria-pressed={plan === item.id}
                      onClick={() => { setOpen(item.id); setPlan(item.id) }}
                    >
                      <span className="plan-heading">
                        <strong>{item.title}</strong>
                        <span className="plan-duration">{item.days}</span>
                        <span className="plan-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="18" height="18"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                      </span>
                      <span className="plan-description">{item.description}</span>
                    </button>
                    <div className="plan-details" hidden={!expanded}>
                      <ul>
                        {item.features.map((feature) => <Feature key={feature} text={feature} doctor={doctor} />)}
                      </ul>
                      <div className="plan-purchase">
                        <span className="plan-price"><strong>{item.price}</strong><span>تومان</span></span>
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
            <button type="button" id="buySelectedPlan" className="plan-continue plans-buy" disabled={!selected} onClick={onBuy}>
              {selected ? 'خرید پلن ' + selected.title : 'خرید پلن'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
