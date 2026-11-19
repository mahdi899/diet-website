/* Adult BMI screening: https://www.nhs.uk/health-assessment-tools/calculate-your-body-mass-index/calculate-bmi-for-adults/ */
(function (global) {
  const number = (raw) => {
    const latin = String(raw ?? '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    return latin.trim() === '' ? NaN : Number(latin);
  };
  const format = value => Number(value).toLocaleString('fa-IR', { maximumFractionDigits: 1 });

  function assess(height, weight, goal) {
    height = number(height);
    weight = number(weight);
    if (goal === 'pregnancy' || !Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) return null;
    const squared = (height / 100) ** 2;
    const bmi = weight / squared;
    return {
      bmi, weight,
      low: Math.ceil(18.5 * squared * 10) / 10,
      high: Math.floor(24.9 * squared * 10) / 10,
      category: bmi < 18.5 ? 'کمبود وزن' : bmi < 25 ? 'محدودهٔ سالم' : bmi < 30 ? 'اضافه‌وزن' : 'چاقی',
      suggestGain: goal === 'weight_loss' && bmi < 18.5,
    };
  }

  function attach(root, { question, questions, answers, goal, onSwitch }) {
    const current = question.metric === 'current-weight';
    if (!current && !question.metric?.startsWith('target-')) return;
    if (goal === 'pregnancy') return;
    const heightIndex = questions.findIndex(q => q.originalNumber === 4);
    const weightIndex = questions.findIndex(q => q.metric === 'current-weight');
    const field = current ? root.querySelector(`input[data-field-index="${weightIndex}"]`) : null;
    const submit = root.querySelector('[data-field-submit]');
    if (!submit) return;
    const section = document.createElement('section');
    section.className = 'weight-guidance';
    section.dataset.weightGuidance = '';
    section.setAttribute('aria-label', 'شاخص تودهٔ بدنی و بازهٔ وزن سالم');
    submit.before(section);
    let latest;
    let lastMarkup = '';
    function refresh() {
      latest = assess(answers[heightIndex], field ? field.value : answers[weightIndex], goal);
      section.hidden = !latest;
      if (!latest) return;
      const { bmi, weight, low, high, category, suggestGain } = latest;
      const markup = `
        <div class="weight-guidance-heading"><strong>BMI شما: ${format(bmi)}</strong><span>${category}</span></div>
        <p>بازهٔ تقریبی وزن سالم برای قد شما: <strong>${format(low)} تا ${format(high)} کیلوگرم</strong></p>
        ${!current ? `<p>وزن فعلی شما: ${format(weight)} کیلوگرم. ${goal === 'weight_gain' ? 'برای افزایش وزن، هدفی بالاتر از وزن فعلی انتخاب کن.' : ''}</p>` : ''}
        ${suggestGain ? `<div class="weight-guidance-suggestion"><p>BMI شما در محدودهٔ کمبود وزن است. پیشنهاد ما تغییر هدف به افزایش وزن و بررسی وزن هدف با متخصص است.</p><button type="button" data-switch-weight-goal class="quiz-green-btn">تغییر هدف به افزایش وزن</button></div>` : ''}
        <small>این بازه برآورد عمومی برای بزرگسالان است، نه وزن هدف قطعی.</small>`;
      if (markup !== lastMarkup) {
        section.innerHTML = markup;
        lastMarkup = markup;
      }
    }
    section.addEventListener('click', event => {
      if (event.target.closest('[data-switch-weight-goal]') && latest?.suggestGain) onSwitch(latest.weight);
    });
    field?.addEventListener('input', refresh);
    refresh();
  }

  global.mydietWeightGuidance = { assess, attach };
})(typeof window === 'undefined' ? globalThis : window);
