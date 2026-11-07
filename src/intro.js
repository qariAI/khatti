/* First-run animated intro (khatti.intro.v1). Four short scenes, skippable, replayable from the footer.
   Uses the existing goal chips' data attributes so welcome.js and path.js handle the choice. */
const KI_KEY='khatti.intro.v1';
function kiSeen(){try{return !!localStorage.getItem(KI_KEY);}catch{return true;}}
function kiMark(how){try{localStorage.setItem(KI_KEY,JSON.stringify({done:how,at:Date.now()}));}catch{}window.dispatchEvent(new CustomEvent('khatti:track',{detail:'intro_'+how}));}
const KI_SCENES=[
 {cap:'Khatti means <em>my handwriting</em>.',sub:'Learn Arabic calligraphy the way it’s written: by hand.',art:'<svg class="ki-svg" viewBox="0 0 400 230" aria-hidden="true"><text class="ki-write" x="200" y="160" text-anchor="middle">خطّي</text><path class="ki-swash" d="M70 200 C150 225 250 175 335 198"/></svg>'},
 {cap:'One path. Four tiers.',sub:'From single letters to full ayahs.',art:'<div class="ki-tiers" aria-hidden="true">'+[['ب','Letters'],['لا','Joins'],['الصبر','Wisdom'],['قل هو الله أحد','Ayahs']].map(([a,l],i)=>'<div class="ki-tier" style="--i:'+i+'"><span lang="ar" dir="rtl">'+a+'</span><small>'+l+'</small></div>').join('')+'<i class="ki-rope"></i></div>'},
 {cap:'Draw with your finger.',sub:'Earn stars. Seal every letter you master.',art:'<div class="ki-demo" aria-hidden="true"><svg class="ki-svg" viewBox="0 0 400 200"><path class="ki-stroke" d="M300 92 C305 135 290 150 200 152 C140 153 110 140 102 112"/><circle class="ki-dot" cx="200" cy="182" r="7"/></svg><div class="ki-stars"><i>★</i><i>★</i><i>★</i></div><em class="ki-seal">خط</em></div>'},
 {cap:'What do you want to write?',sub:'Every goal starts on The Scribe’s Path.',art:'<div class="ki-goals"><button type="button" data-ki-goal data-goal="hand" data-path data-sp-goto="1"><span lang="ar" dir="rtl">ا ب ت</span>The letters</button><button type="button" data-ki-goal data-goal="dua" data-path data-sp-goto="2"><span lang="ar" dir="rtl">بسم الله</span>Short duas</button><button type="button" data-ki-goal data-goal="ayah" data-path data-sp-goto="4"><span lang="ar" dir="rtl">قل هو الله أحد</span>Ayahs</button></div><button type="button" class="ki-free" data-ki-close="draw">Just let me draw</button>'}];
let kiEl=null,kiAt=0,kiTimer=0;
function kiRender(){if(!kiEl)return;clearTimeout(kiTimer);const s=KI_SCENES[kiAt],last=kiAt===KI_SCENES.length-1;
 kiEl.querySelector('.ki-stage').innerHTML='<div class="ki-scene" data-scene="'+kiAt+'">'+(last?'<h2>'+s.cap+'</h2><p>'+s.sub+'</p>'+s.art:s.art+'<h2>'+s.cap+'</h2><p>'+s.sub+'</p>')+'</div>';
 kiEl.querySelectorAll('.ki-dots i').forEach((d,i)=>d.classList.toggle('on',i===kiAt));
 const nx=kiEl.querySelector('.ki-next');nx.hidden=last;kiEl.querySelector('.ki-skip').hidden=last;
 if(!last&&!document.body.classList.contains('reduce-motion'))kiTimer=setTimeout(()=>{kiAt++;kiRender();},kiAt===0?4200:3800);
 (last?kiEl.querySelector('[data-ki-goal]'):nx)?.focus({preventScroll:true});}
function kiClose(how){if(!kiEl)return;clearTimeout(kiTimer);kiMark(how);const el=kiEl;kiEl=null;el.classList.add('ki-out');setTimeout(()=>el.remove(),260);document.body.classList.remove('ki-open');}
export function kiOpen(){if(kiEl)return;document.querySelector('#my-work [data-work="close"]')?.click();kiAt=0;kiEl=document.createElement('div');kiEl.id='khatti-intro';kiEl.setAttribute('role','dialog');kiEl.setAttribute('aria-modal','true');kiEl.setAttribute('aria-label','Welcome to Khatti');
 kiEl.innerHTML='<button type="button" class="ki-skip" data-ki-close="skip">Skip</button><div class="ki-stage"></div><div class="ki-foot"><div class="ki-dots">'+KI_SCENES.map(()=>'<i></i>').join('')+'</div><button type="button" class="ki-next">Next →</button></div>';
 document.body.append(kiEl);document.body.classList.add('ki-open');window.dispatchEvent(new CustomEvent('khatti:track',{detail:'intro_shown'}));
 const go=()=>kiRender();(document.fonts&&document.fonts.load?document.fonts.load('120px HarfNaskh','خطّي ب'):Promise.resolve()).then(go,go);}
export function installIntro(){if(typeof document==='undefined'||window.__khattiIntro)return;window.__khattiIntro=1;
 document.addEventListener('click',e=>{const r=e.target.closest('[data-khatti-intro]');if(r){e.preventDefault();kiOpen();return;}if(!kiEl||!kiEl.contains(e.target))return;
  const c=e.target.closest('[data-ki-close]');if(c){kiClose(c.dataset.kiClose);return;}
  if(e.target.closest('[data-ki-goal]')){document.querySelector('.wl-card:not(.back)')?.remove();kiClose('goal');return;}
  if(e.target.closest('.ki-next')||(e.target.closest('.ki-stage')&&kiAt<KI_SCENES.length-1)){kiAt=Math.min(kiAt+1,KI_SCENES.length-1);kiRender();}});
 document.addEventListener('keydown',e=>{if(kiEl&&e.key==='Escape')kiClose('skip');});
 const auto=()=>{let off=false;try{off=localStorage.getItem('harf.intros.auto.v1')==='false'||!!localStorage.getItem('khatti_path_progress');}catch{}if(navigator.webdriver&&!window.__khattiIntroTest)off=true;if(!kiSeen()&&!off)kiOpen();};
 if(document.readyState==='complete')setTimeout(auto,300);else window.addEventListener('load',()=>setTimeout(auto,300));}
if(typeof document!=='undefined')installIntro();
