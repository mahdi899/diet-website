/* Anonymous funnel telemetry. Never read input values or questionnaire answers. */
(() => {
  if (!window.MYDIET_TRACKING?.websiteId || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  try { if(localStorage.getItem('mydiet.analytics.disabled')==='1')return; } catch { /* storage may be unavailable */ }
  const goals=new Set(['weight_loss','weight_gain','pregnancy','detox']);
  const queue=[];
  let current=location.pathname.endsWith('goals.html')?'goals':location.pathname.endsWith('quiz.html')?'quiz':location.pathname.endsWith('payment.html')?'payment':'intro';
  // One anonymous path per tab; returning to the start/goal page begins a new
  // path. Reloading quiz resets its answers, so that also begins a new path.
  const page=current;
  const journeyKey='mydiet.analytics.journey';
  const campaignKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const entryParams=new URLSearchParams(location.search);
  let journey, attribution={};
  const rememberJourney=()=>{
    try{sessionStorage.setItem(journeyKey,JSON.stringify({id:journey,page,attribution}));}catch{}
  };
  const selectJourney=()=>{
    let saved;try{saved=JSON.parse(sessionStorage.getItem(journeyKey)||'null');}catch{}
    const valid=saved&&/^[0-9a-f-]{36}$/.test(saved.id);
    const restart=page==='intro'||(saved?.page==='quiz'&&page!=='payment');
    journey=valid&&!restart?saved.id:crypto.randomUUID();
    attribution={};
    for(const key of campaignKeys) {
      const value=entryParams.get(key) ?? (valid && page!=='intro' ? saved.attribution?.[key] : null);
      if(typeof value==='string'&&/^[a-zA-Z0-9_.-]{1,80}$/.test(value))attribution[key]=value;
    }
    rememberJourney();
  };
  selectJourney();
  let context={},lastTick=performance.now(),lastActivity=lastTick,activeMs=0,hidden=document.hidden;
  const event=(name,data={})=>{
    const item={name,data:{step:current,journey,...context,...data}};
    if(window.umami) { try { Promise.resolve(window.umami.track(item.name,item.data)).catch(()=>{}); } catch { /* analytics never blocks navigation */ } }
    else if(queue.length<200)queue.push(item);
  };
  const clock=()=>{
    const now=performance.now();
    if(!hidden)activeMs+=Math.max(0,Math.min(now-lastTick,15000,lastActivity+60000-lastTick));
    lastTick=now;
  };
  const flush=()=>{clock();if(activeMs>=1){event('step_time',{activeMs:Math.round(activeMs)});activeMs=0;}};
  window.demoTracking={
    step(name,data={}) {
      const next=name==='question'?`question:${data.goal}:${data.question}`:name;
      if(next===current)return;
      flush();current=next;context={};
      if(goals.has(data.goal))context.goal=data.goal;
      if(Number.isInteger(data.question))context.question=data.question;
      event('step_view');
    },
    complete(){event('questionnaire_completed');},
    registered(){event('phone_registered');},
    journeyId(){return journey;},
  };
  window.mydietBeforeSend=(type,payload)=>{
    if(type!=='event')return false;
    const url=new URL(payload.url,location.origin),safe=new URLSearchParams();
    for(const key of campaignKeys) {
      const value=url.searchParams.get(key) ?? attribution[key];
      if(value&&/^[a-zA-Z0-9_.-]{1,80}$/.test(value))safe.set(key,value);
    }
    const goal=url.searchParams.get('goal');if(goals.has(goal))safe.set('goal',goal);
    const data={};
    for(const [key,value] of Object.entries(payload.data||{})) {
      if(key==='step'&&/^(intro|goals|quiz|preparing|specialists|plans|contact|otp|payment|payment_gateway|payment_transfer|payment_success|question:(weight_loss|weight_gain|pregnancy|detox):\d{1,3})$/.test(value))data[key]=value;
      if(key==='journey'&&typeof value==='string'&&/^[0-9a-f-]{36}$/.test(value))data[key]=value;
      if(key==='goal'&&goals.has(value))data[key]=value;
      if(key==='question'&&Number.isInteger(value)&&value>=0&&value<1000)data[key]=value;
      if(key==='activeMs'&&Number.isFinite(value))data[key]=Math.max(0,Math.min(30000,value));
    }
    let referrer='';try{const ref=new URL(payload.referrer);referrer=ref.origin===location.origin?ref.origin+ref.pathname:ref.origin;}catch{}
    return {...payload,url:url.pathname+(safe.size?'?'+safe:''),referrer,title:'My Diet Onboarding',data};
  };
  for(const type of ['pointerdown','keydown','touchstart','scroll'])addEventListener(type,()=>{lastActivity=performance.now();},{passive:true});
  const heartbeat=()=>{if(!document.hidden)event('active_heartbeat');};
  setInterval(()=>{flush();heartbeat();},10000);
  heartbeat();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)event('presence_end');else heartbeat();});
  addEventListener('pagehide',()=>event('presence_end'));
  document.addEventListener('visibilitychange',()=>{flush();hidden=document.hidden;lastTick=performance.now();if(!hidden)lastActivity=lastTick;});
  addEventListener('pagehide',flush);
  addEventListener('pageshow',e=>{if(e.persisted){
    if(page!=='quiz')selectJourney();
    else rememberJourney();
    lastTick=performance.now();lastActivity=lastTick;event('step_view');
  }});
  document.addEventListener('click',e=>{
    const target=e.target.closest?.('button,a');if(!target)return;
    if(target.dataset.trackingGoal)event('goal_selected',{goal:target.dataset.trackingGoal});
    else if(target.id==='letsGoBtn')event('start_clicked');
    else if(target.matches('[data-q-index],[data-field-submit],[data-detail-submit],[data-multi-submit],[data-skip-index]'))event('question_interacted');
    else if(['backToGoalsBtn','appLogoHomeBtn','scrollPrevAnsweredBtn'].includes(target.id))event('back_clicked');
  },true);
  event('step_view');
  const script=document.createElement('script');script.src='/insights/script.js';script.defer=true;
  script.dataset.websiteId=window.MYDIET_TRACKING.websiteId;script.dataset.hostUrl=location.origin+'/insights';
  script.dataset.autoPageview='false';script.dataset.excludeHash='true';script.dataset.beforeSend='mydietBeforeSend';
  script.onload=()=>{try{Promise.resolve(window.umami.track()).catch(()=>{});}catch{}for(const item of queue.splice(0))event(item.name,item.data);};
  script.onerror=()=>{queue.length=0;};document.head.append(script);
})();
