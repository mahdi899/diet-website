/* Initial estimates at the chosen pace; final energy limits are applied by the nutrition engine. */
(function (global) {
  const RATES = { slow: 0.25, balanced: 0.5, fast: 0.75, auto: 0.5 };
  const format = value => Number(value).toLocaleString('fa-IR', { maximumFractionDigits: 2 });
  const numeric = value => {
    const latin = String(value ?? '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[٫]/g, '.');
    return latin.trim() ? Number(latin) : NaN;
  };

  function estimate(pace, weight, target, height) {
    weight = numeric(weight);
    target = numeric(target);
    height = numeric(height);
    if (!Object.hasOwn(RATES, pace) || !Number.isFinite(weight) || !Number.isFinite(target) ||
        weight <= 0 || target <= 0 || target >= weight) return null;
    if (Number.isFinite(height) && height > 0 && target / (height / 100) ** 2 < 18.5) return null;
    const weeklyRate = Math.min(RATES[pace], weight * 0.01);
    const months = (weight - target) / weeklyRate / (365.25 / 12 / 7);
    return { months, weeklyRate, minMonths: Math.floor(months), maxMonths: Math.ceil(months) };
  }

  function describe(pace, questions, answers) {
    const value = predicate => answers[questions.findIndex(predicate)];
    const weight = value(q => q.metric === 'current-weight');
    const target = value(q => q.metric === 'target-loss');
    const height = value(q => q.originalNumber === 4);
    const result = estimate(pace, weight, target, height);
    if (!result) return 'زمان مناسب پس از بررسی قد، وزن و وزن هدف مشخص می‌شود';
    const duration = result.maxMonths <= 1 ? 'حدود ۱ ماه یا کمتر' :
      result.minMonths === result.maxMonths ? `حدود ${format(result.maxMonths)} ماه` :
      `حدود ${format(result.minMonths)} تا ${format(result.maxMonths)} ماه`;
    return `${duration} · با سرعت اولیهٔ حدود ${format(result.weeklyRate)} کیلوگرم در هفته`;
  }

  global.mydietLossPace = { estimate, describe };
})(typeof window === 'undefined' ? globalThis : window);
