/** Source: پرسشنامه اصلی.docx — grouped like the official questionnaire. */
(function (global) {
  const O = (label, icon = '•', extra = {}) => ({ label, icon, ...extra });

  const AGE_RANGE_OPTIONS = [
    O('۱۸ تا ۳۰ سال', '•', { image: 'assets/age-18-30.jpg' }),
    O('۳۰ تا ۴۰ سال', '•', { image: 'assets/age-30-40.jpg' }),
    O('۴۰ تا ۵۰ سال', '•', { image: 'assets/age-40-50.jpg' }),
    O('بالای ۵۰ سال', '•', { image: 'assets/age-50-plus.jpg' }),
  ];

  const CAT = {
    general: 'سوالات کلی',
    loss: 'سوالات هدف لاغری',
    gain: 'سوالات هدف افزایش وزن',
    preg: 'سوالات هدف بارداری و شیردهی',
    pregP: 'سؤالات مخصوص بارداری',
    pregL: 'سؤالات مخصوص شیردهی',
    health: 'سوالات هدف سلامت و پاکسازی بدن',
  };

  /** تصویر مرتبط با موضوع سؤال، از بانک محلی تصاویر. */
  const QUESTION_HERO_IMAGE = 'assets/quiz-hero-diet.jpg';

  function applyHeroImages(questions) {
    return questions.map((q) => {
      const title = q.q || '';
      let heroImage = QUESTION_HERO_IMAGE;
      if (/باردار|بارداری|جنین|سه‌ماهه/.test(title)) heroImage = 'assets/goal-maternal.jpg';
      else if (/ورزش|تمرین|فعالیت بدنی/.test(title)) heroImage = 'assets/sport-strength.jpg';
      else if (/شغل|کار روزانه|فعالیت روزانه/.test(title)) heroImage = 'assets/activity-mixed.jpg';
      else if (/گیاه|وگان|سبزی/.test(title)) heroImage = 'assets/diet-vegan.jpg';
      else if (/بیماری|دارو|آزمایش|پزشک/.test(title)) heroImage = 'assets/intro-specialist.jpg';
      else if (/افزایش وزن|اشتها/.test(title)) heroImage = 'assets/goal-gain-v2.png';
      return { ...q, heroImage };
    });
  }

  function withGeneral(goalQuestions) {
    return applyHeroImages(GENERAL_QUESTIONS.concat(goalQuestions)).map((q, i) => ({ ...q, originalNumber: i + 1 }));
  }

  const GENERAL_QUESTIONS = [
    { category: CAT.general, q: 'اسم شما چیست؟', type: 'text', subtitle: 'متن', placeholder: 'نام و نام خانوادگی' },
    {
      category: CAT.general,
      q: 'چند سال داری؟',
      ui: 'age-range',
      options: AGE_RANGE_OPTIONS,
    },
    {
      category: CAT.general,
      q: 'جنسیتت چیه؟',
      subtitle: 'یک گزینه را انتخاب کن',
      options: [O('زن'), O('مرد')],
    },
    { category: CAT.general, q: 'قدت چقدره؟', type: 'number', subtitle: 'سانتی‌متر', placeholder: 'مثلاً ۱۶۵', slider: { min: 120, max: 230, step: 1, default: 165, unit: 'سانتی‌متر' } },
    { category: CAT.general, q: 'وزن فعلیت چقدره؟', type: 'number', metric: 'current-weight', subtitle: 'کیلوگرم', placeholder: 'مثلاً ۷۲', slider: { min: 35, max: 240, step: 1, default: 68, unit: 'کیلوگرم' } },
    {
      category: CAT.general,
      q: 'میزان فعالیت روزانه‌ات چقدره؟',
      options: [O('خیلی کم'), O('کم'), O('متوسط'), O('زیاد'), O('خیلی زیاد')],
    },
    {
      category: CAT.general,
      q: 'معمولاً چند وعده در روز غذا می‌خوری؟',
      options: [O('۱ وعده'), O('۲ وعده'), O('۳ وعده'), O('بیشتر')],
    },
    {
      category: CAT.general,
      q: 'به چه غذاهایی حساسیت داری؟',
      multi: true,
      exclusiveLabels: ['بدون حساسیت'],
      options: [O('بدون حساسیت'), O('لبنیات'), O('آجیل'), O('تخم‌مرغ'), O('گلوتن'), O('سایر')],
      followUpText: true,
      followUpWhenLabel: ['لبنیات', 'آجیل', 'تخم‌مرغ', 'گلوتن', 'سایر'],
      followUpLabel: 'دقیقاً به کدام خوراکی‌ها حساسیت داری؟',
      followUpPlaceholder: 'مثلاً لبنیات: فقط شیر؛ آجیل: بادام',
    },
    {
      category: CAT.general,
      q: 'سبک تغذیه‌ات چیه؟',
      ui: 'option-cards',
      options: [
        O('همه‌چیزخواری', '•', { image: 'assets/diet-normal.jpg', description: 'غذاهای گیاهی و حیوانی' }),
        O('گیاه‌خواری با لبنیات یا تخم‌مرغ', '•', { image: 'assets/diet-vegetarian.jpg', description: 'بدون گوشت، مرغ و ماهی' }),
        O('وگان (کاملاً گیاهی)', '•', { image: 'assets/diet-vegan.jpg', description: 'بدون گوشت، لبنیات، تخم‌مرغ و سایر محصولات حیوانی' }),
      ],
    },
    {
      category: CAT.general,
      q: 'بیماری خاص یا شرایط پزشکی داری؟',
      multi: true,
      exclusiveLabels: ['خیر'],
      options: [
        O('خیر'),
        O('دیابت'),
        O('فشار خون'),
        O('بیماری کلیوی'),
        O('تیروئید'),
        O('مشکلات گوارشی'),
        O('سایر'),
      ],
      followUpText: true,
      followUpWhenLabel: 'سایر',
      followUpPlaceholder: 'نوع بیماری را بنویسید',
    },
    {
      category: CAT.general,
      q: 'دارو یا مکمل خاصی مصرف می‌کنی؟',
      options: [O('خیر'), O('بله')],
      subtitle: 'در صورت «بله» نام را در کادر بنویس',
      followUpText: true,
    },
    {
      category: CAT.general,
      q: 'چه غذاهایی را دوست نداری یا نمی‌خوری؟',
      type: 'text',
      optional: true,
      subtitle: 'انتخاب یا متن',
      placeholder: 'مثلاً بادمجان، ماهی…',
    },
    {
      category: CAT.general,
      q: 'معمولاً چه ساعت‌هایی می‌خوابی و بیدار می‌شی؟',
      ui: 'sleep-wake',
      defaultSleep: 23,
      defaultWake: 7,
    },
    {
      category: CAT.general,
      q: 'چقدر برای آماده‌کردن غذا وقت داری؟',
      options: [O('کمتر از ۱۵ دقیقه'), O('۱۵ تا ۳۰ دقیقه'), O('بیشتر')],
    },
    {
      category: CAT.general,
      q: 'بودجه غذایی موردنظرت چقدره؟',
      options: [O('اقتصادی'), O('متوسط'), O('بدون محدودیت')],
    },
    {
      category: CAT.general,
      q: 'شغل یا فعالیت روزانه‌ات بیشتر چه شکلیه؟',
      ui: 'option-cards',
      options: [
        O('نشسته', '•', { image: 'assets/activity-sedentary.jpg' }),
        O('ترکیبی', '•', { image: 'assets/activity-mixed.jpg' }),
        O('سرپا', '•', { image: 'assets/activity-standing.jpg' }),
        O('کار فیزیکی سنگین', '•', { image: 'assets/activity-heavy.jpg' }),
      ],
    },
    {
      category: CAT.general,
      q: 'هفته‌ای چند روز ورزش می‌کنی؟',
      options: [O('ورزش نمی‌کنم'), O('۱ روز'), O('۲ روز'), O('۳ روز'), O('۴ روز'), O('۵ روز'), O('۶ روز'), O('۷ روز')],
    },
    {
      category: CAT.general,
      q: 'هر جلسه تقریباً چقدر ورزش می‌کنی؟',
      options: [O('کمتر از ۳۰ دقیقه'), O('۳۰ تا ۶۰ دقیقه'), O('بیشتر')],
    },
    {
      category: CAT.general,
      q: 'چه نوع ورزشی انجام می‌دی؟',
      ui: 'option-cards',
      options: [
        O('قدرتی', '•', { image: 'assets/sport-strength.jpg' }),
        O('هوازی', '•', { image: 'assets/sport-cardio.jpg' }),
        O('ترکیبی', '•', { image: 'assets/sport-combined.jpg' }),
        O('سایر', '•', { image: 'assets/sport-other.jpg' }),
      ],
    },
  ];

  const LOSS_QUESTIONS = [
    { category: CAT.loss, q: 'دوست داری به چه وزنی برسی؟', type: 'number', metric: 'target-loss', subtitle: 'کیلوگرم', placeholder: 'وزن هدف' },
    {
      category: CAT.loss,
      q: 'ترجیح می‌دی با چه سرعتی وزن کم کنی؟',
      ui: 'loss-pace',
      subtitle: 'سرعت ایمن را سیستم بر اساس شرایط تو پیشنهاد می‌دهد',
      options: [
        O('آهسته و تدریجی', '•', { pace: 'slow' }),
        O('متعادل و پایدار', '•', { pace: 'balanced' }),
        O('می‌خوام زودتر به نتیجه برسم', '•', { pace: 'fast' }),
        O('نمی‌دونم، خود برنامه پیشنهاد بده', '•', { pace: 'auto' }),
      ],
    },
    {
      category: CAT.loss,
      q: 'بزرگ‌ترین چالشت برای کاهش وزن چیه؟',
      multi: true,
      options: [
        O('ریزه‌خواری در طول روز'),
        O('علاقه زیاد به شیرینی و تنقلات'),
        O('پرخوری در وعده‌های اصلی'),
        O('غذا خوردن هنگام استرس'),
        O('کمبود فعالیت بدنی'),
        O('نامنظم بودن وعده‌های غذایی'),
      ],
    },
    {
      category: CAT.loss,
      q: 'معمولاً چه زمانی بیشتر احساس گرسنگی می‌کنی؟',
      options: [O('صبح'), O('ظهر'), O('عصر'), O('شب'), O('در تمام طول روز')],
    },
    {
      category: CAT.loss,
      q: 'چقدر از غذاهای بیرون یا فست‌فود استفاده می‌کنی؟',
      options: [O('به‌ندرت'), O('۱ تا ۲ بار در هفته'), O('۳ تا ۴ بار در هفته'), O('تقریباً هر روز')],
    },
    {
      category: CAT.loss,
      q: 'در گذشته برای کاهش وزن رژیم گرفتی؟',
      options: [O('خیر، اولین بارم است'), O('بله، نتیجه گرفتم'), O('بله، ولی وزنم برگشت'), O('بله، ولی نتونستم ادامه بدم')],
    },
    {
      category: CAT.loss,
      q: 'معمولاً در طول روز چقدر احساس گرسنگی یا ولع غذایی داری؟',
      options: [O('خیلی کم'), O('متوسط'), O('زیاد'), O('خیلی زیاد')],
    },
    {
      category: CAT.loss,
      q: 'آیا سابقه پرخوری همراه با احساس از دست دادن کنترل، یا محدود کردن شدید غذا داری؟',
      options: [O('خیر'), O('بله'), O('ترجیح می‌دم پاسخ ندم')],
    },
  ];

  const GAIN_QUESTIONS = [
    { category: CAT.gain, q: 'دوست داری وزنت به چند کیلوگرم برسه؟', type: 'number', metric: 'target-gain', subtitle: 'کیلوگرم', placeholder: 'وزن هدف' },
    {
      category: CAT.gain,
      q: 'هدفت از افزایش وزن بیشتر چیه؟',
      options: [O('افزایش حجم عضلات'), O('رسیدن به وزن سالم'), O('پرتر شدن اندام'), O('جبران کاهش وزن قبلی')],
    },
    {
      category: CAT.gain,
      q: 'وضعیت اشتهای خودت را چطور توصیف می‌کنی؟',
      options: [O('خیلی کم'), O('کم'), O('معمولی'), O('زیاد')],
    },
    {
      category: CAT.gain,
      q: 'چرا فکر می‌کنی افزایش وزن برات سخته؟',
      options: [
        O('زود احساس سیری می‌کنم'),
        O('معمولاً وعده‌های غذایی را فراموش می‌کنم'),
        O('فعالیت بدنی زیادی دارم'),
        O('با وجود غذا خوردن وزنم زیاد نمی‌شود'),
        O('نمی‌دونم'),
      ],
    },
    {
      category: CAT.gain,
      q: 'آیا اخیراً بدون اینکه بخواهی وزن کم کردی؟',
      medicalReviewWhenLabels: ['بله، کمی', 'بله، به مقدار قابل‌توجه'],
      options: [O('خیر'), O('بله، کمی'), O('بله، به مقدار قابل‌توجه')],
    },
    {
      category: CAT.gain,
      q: 'فعالیت ورزشی تو بیشتر از چه نوعیه؟',
      options: [O('ورزش نمی‌کنم'), O('تمرینات بدنسازی'), O('تمرینات هوازی'), O('ورزش ترکیبی'), O('فعالیت بدنی سنگین در کار')],
    },
    {
      category: CAT.gain,
      q: 'خوردن وعده‌های بزرگ برات چقدر راحته؟',
      options: [O('راحت است'), O('وعده‌های کوچک را ترجیح می‌دهم'), O('خیلی زود سیر می‌شوم')],
    },
    {
      category: CAT.gain,
      q: 'برای اضافه کردن میان‌وعده به برنامه روزانه‌ات آمادگی داری؟',
      options: [O('بله، دو یا چند میان‌وعده'), O('بله، یک میان‌وعده'), O('ترجیح می‌دهم وعده‌های اصلی بیشتر شود')],
    },
  ];

  const PREGNANCY_QUESTIONS = [
    {
      category: CAT.preg,
      q: 'در چه مرحله‌ای هستی؟',
      options: [O('باردار هستم'), O('در دوران شیردهی هستم')],
    },
    { category: CAT.pregP, q: 'در هفته چندم بارداری هستی؟', type: 'number', subtitle: 'هفته بارداری', placeholder: 'مثلاً ۱۲' },
    { category: CAT.pregP, q: 'قبل از بارداری چند کیلوگرم وزن داشتی؟', type: 'number', subtitle: 'کیلوگرم', placeholder: 'وزن قبل از بارداری' },
    {
      category: CAT.pregP,
      q: 'بارداری تو از چه نوعیه؟',
      options: [O('تک‌قلو'), O('دوقلو'), O('سه‌قلو یا بیشتر')],
    },
    {
      category: CAT.pregP,
      q: 'آیا پزشک برای وزن‌گیری یا تغذیه‌ات توصیه خاصی داشته؟',
      options: [
        O('خیر'),
        O('بله، کنترل افزایش وزن'),
        O('بله، نیاز به افزایش وزن بیشتر'),
        O('بله، محدودیت غذایی یا توصیه پزشکی دیگر'),
      ],
    },
    {
      category: CAT.pregP,
      q: 'در دوران بارداری کدام مشکلات را تجربه می‌کنی؟',
      multi: true,
      exclusiveLabels: ['هیچ‌کدام'],
      options: [O('تهوع'), O('استفراغ'), O('یبوست'), O('سوزش معده'), O('بی‌اشتهایی'), O('هیچ‌کدام')],
    },
    {
      category: CAT.pregP,
      q: 'آیا به یکی از شرایط زیر مبتلا هستی؟',
      multi: true,
      exclusiveLabels: ['هیچ‌کدام'],
      options: [
        O('دیابت بارداری'),
        O('فشار خون بالا یا پره‌اکلامپسیا'),
        O('کم‌خونی'),
        O('بیماری تیروئید'),
        O('سایر مشکلات پزشکی'),
        O('هیچ‌کدام'),
      ],
    },
    {
      category: CAT.pregP,
      q: 'چه مکمل‌هایی مصرف می‌کنی؟',
      multi: true,
      exclusiveLabels: ['هیچ‌کدام'],
      options: [O('اسید فولیک'), O('آهن'), O('ویتامین D'), O('مولتی‌ویتامین بارداری'), O('سایر'), O('هیچ‌کدام')],
    },
    {
      category: CAT.pregP,
      q: 'آیا پزشک مصرف غذا یا مکمل خاصی را برای تو محدود یا توصیه کرده؟',
      options: [O('خیر'), O('بله')],
      followUpText: true,
    },
    { category: CAT.pregL, q: 'چند ماه از زایمانت گذشته؟', type: 'number', subtitle: 'عدد', placeholder: 'مثلاً ۴' },
    {
      category: CAT.pregL,
      q: 'به چه شکلی به نوزادت شیر می‌دی؟',
      options: [O('فقط شیر مادر'), O('ترکیبی از شیر مادر و شیر خشک'), O('شیردهی کم یا گهگاهی')],
    },
    { category: CAT.pregL, q: 'چند ماهه که شیردهی را شروع کردی؟', type: 'number', subtitle: 'عدد', placeholder: 'مثلاً ۲' },
    { category: CAT.pregL, q: 'وزنت قبل از بارداری چقدر بوده؟', type: 'number', subtitle: 'کیلوگرم', placeholder: 'وزن قبل از بارداری' },
    {
      category: CAT.pregL,
      q: 'هدفت در دوران شیردهی چیه؟',
      options: [O('تغذیه سالم و متعادل'), O('حفظ وزن فعلی'), O('بازگشت تدریجی به وزن قبل از بارداری'), O('تأمین انرژی بیشتر')],
    },
    {
      category: CAT.pregL,
      q: 'وضعیت انرژی و اشتهای خودت را چطور ارزیابی می‌کنی؟',
      options: [O('انرژی و اشتهای مناسبی دارم'), O('بیشتر اوقات خسته‌ام'), O('اشتهای زیادی دارم'), O('اشتهای کمی دارم')],
    },
    {
      category: CAT.pregL,
      q: 'آیا درباره میزان شیر یا رشد نوزاد نگرانی پزشکی مطرح شده؟',
      options: [O('خیر'), O('بله'), O('در حال بررسی توسط پزشک هستم')],
    },
    {
      category: CAT.pregL,
      q: 'آیا مکمل یا داروی خاصی در دوران شیردهی مصرف می‌کنی؟',
      options: [O('خیر'), O('بله')],
      followUpText: true,
    },
  ];

  const HEALTH_QUESTIONS = [
    {
      category: CAT.health,
      q: 'بیشتر دوست داری کدام بخش از سلامتت بهتر بشه؟',
      multi: true,
      options: [
        O('افزایش انرژی روزانه'),
        O('بهبود کیفیت تغذیه'),
        O('سلامت دستگاه گوارش'),
        O('بهبود کیفیت خواب'),
        O('حفظ وزن سالم'),
        O('کاهش مصرف غذاهای ناسالم'),
      ],
    },
    {
      category: CAT.health,
      q: 'معمولاً در طول روز چقدر آب می‌نوشی؟',
      options: [O('کمتر از ۴ لیوان'), O('۴ تا ۶ لیوان'), O('۷ تا ۹ لیوان'), O('بیشتر از ۹ لیوان')],
    },
    {
      category: CAT.health,
      q: 'در طول روز چقدر میوه و سبزیجات مصرف می‌کنی؟',
      options: [O('تقریباً هیچ'), O('۱ تا ۲ وعده'), O('۳ تا ۴ وعده'), O('۵ وعده یا بیشتر')],
    },
    {
      category: CAT.health,
      q: 'وضعیت گوارشت معمولاً چطوره؟',
      multi: true,
      lockOtherChoicesWhen: 'طبیعی',
      exclusiveLabels: ['طبیعی'],
      options: [O('طبیعی'), O('یبوست مکرر'), O('نفخ'), O('سوزش معده'), O('اسهال مکرر'), O('مشکلات دیگر')],
    },
    {
      category: CAT.health,
      q: 'چقدر از خوراکی‌های شیرین یا غذاهای فرآوری‌شده استفاده می‌کنی؟',
      options: [O('به‌ندرت'), O('چند بار در هفته'), O('تقریباً هر روز'), O('چند بار در روز')],
    },
    {
      category: CAT.health,
      q: 'کیفیت خوابت را چطور ارزیابی می‌کنی؟',
      options: [O('خیلی خوب'), O('خوب'), O('متوسط'), O('ضعیف')],
    },
    {
      category: CAT.health,
      q: 'بیشتر دوست داری چه تغییری در تغذیه‌ات ایجاد کنی؟',
      multi: true,
      options: [
        O('وعده‌های منظم‌تر'),
        O('مصرف سبزیجات بیشتر'),
        O('کاهش قندهای افزوده'),
        O('مصرف غذاهای خانگی بیشتر'),
        O('افزایش تنوع غذایی'),
        O('داشتن یک برنامه متعادل و قابل‌ادامه'),
      ],
    },
    {
      category: CAT.health,
      q: 'آیا پزشک برای بهبود وضعیت سلامتت توصیه غذایی خاصی داشته؟',
      multi: true,
      exclusiveLabels: ['خیر'],
      followUpText: true,
      followUpWhenLabel: 'سایر موارد',
      followUpPlaceholder: 'توصیهٔ پزشک را توضیح بده',
      options: [
        O('خیر'),
        O('بله، کنترل قند خون'),
        O('بله، کنترل فشار خون'),
        O('بله، کنترل چربی خون'),
        O('بله، برای مشکلات گوارشی'),
        O('سایر موارد'),
      ],
    },
  ];

  const goals = [
    {
      id: 'weight_loss',
      title: 'لاغری',
      badge: 'کاهش وزن',
      icon: '🔥',
      image: 'assets/goal-loss.jpg',
      desc: 'برنامه غذایی متناسب با هدف کاهش وزن و شرایط تو',
      calories: '۱,۴۵۰ کیلوکالری در روز',
      questions: withGeneral(LOSS_QUESTIONS),
    },
    {
      id: 'weight_gain',
      title: 'افزایش وزن',
      badge: 'افزایش سالم',
      icon: '🥑',
      image: 'assets/goal-gain-v2.png',
      desc: 'رسیدن به وزن سالم با تغذیه متعادل',
      calories: '۲,۶۵۰ کیلوکالری در روز',
      questions: withGeneral(GAIN_QUESTIONS),
    },
    {
      id: 'pregnancy',
      title: 'بارداری و شیردهی',
      badge: 'ایمن و تخصصی',
      icon: '🤰',
      image: 'assets/goal-maternal.jpg',
      desc: 'تغذیه دوران بارداری و شیردهی با توجه به وضعیت پزشکی',
      calories: '۲,۲۵۰ کیلوکالری در روز',
      questions: withGeneral(PREGNANCY_QUESTIONS),
    },
    {
      id: 'detox',
      title: 'سلامت و پاکسازی بدن',
      badge: 'تعادل و انرژی',
      icon: '🌿',
      image: 'assets/goal-wellness.jpg',
      desc: 'بهبود کیفیت تغذیه، گوارش و انرژی روزانه',
      calories: '۱,۷۵۰ کیلوکالری در روز',
      questions: withGeneral(HEALTH_QUESTIONS),
    },
  ];

  global.SABZINE_QUESTIONNAIRE = { goals, CAT };
})(typeof window !== 'undefined' ? window : globalThis);
