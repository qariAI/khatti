import {atSmooth,atNib,atFoilLine,atPaper,AT_THEMES} from './atelier.js';
import {stampSignature} from './signature.js';

/* ===== The Scribe's Path (طريق الخطاط) — progressive mastery mode =====
   Scores compare your ink with a typeset Naskh model (HarfNaskh) — a practice aid, not a teacher's assessment.
   Thresholds are uncalibrated against real handwriting; tune SP_* constants after device testing. */
/* scoring tolerances (mask px, 4 px = 16 design units) and the F-score window mapped to 0-100%.
   Calibrated by simulation (tests/path-calibration.cjs): careful or finger tracing 3 stars, sloppy 2, 25-unit offset 1-2, undersized or scribbled 0. Re-tune after real-device data. */
const SP_CFG={r1:3,r:3,rr:4,lo:.55,hi:.92};
const SP_KEY='khatti_path_progress',SP_UNLOCK=80,SP_STAR=[55,70,85],SP_LAWHA=88,SP_SEAL_MIN=70,SP_MS=.25;
/* writing-surface design space: landscape 1000x560, or portrait 640x880 on tall phones so the canvas fills the screen */
let SP_W=1000,SP_H=560;
const spSetDims=portrait=>{SP_W=portrait?640:1000;SP_H=portrait?880:560;};
const SP_TIERS=[
 {n:1,ar:'المفردات',en:'Al-Mufradat',sub:'Single letters · stroke control',strict:true,fade:false,items:[
  ['ا','Alif','ا','Alif','The vertical staff: every letter is measured against it.',90],
  ['ب','Ba','ب','Ba','A shallow bowl with a single dot beneath.'],
  ['د','Dal','د','Dal','A compact hook that turns on a firm baseline.'],
  ['ر','Ra','ر','Ra','A quick descending curve below the line.'],
  ['س','Sin','س','Sin','Three teeth in rhythm.'],
  ['ع','Ayn','ع','Ayn','An open eye over a sweeping tail.'],
  ['م','Mim','م','Mim','A closed head with a short tail.'],
  ['ل','Lam','ل','Lam','A tall stem and a deep, round tail.',90],
  ['ت','Ta','ت','Ta','Two dots above a shallow bowl.'],
  ['ث','Tha','ث','Tha','Three dots above a shallow bowl.'],
  ['ج','Jim','ج','Jim','A hook that opens beneath a single dot.'],
  ['ح','Ha','ح','Ha','The open hook, no dot.'],
  ['خ','Kha','خ','Kha','The open hook with a dot above.'],
  ['ذ','Dhal','ذ','Dhal','Dal with a dot above.'],
  ['ز','Zay','ز','Zay','Ra with a dot above.'],
  ['ش','Shin','ش','Shin','Sin with three dots above.'],
  ['ص','Sad','ص','Sad','A closed loop with a sweeping tail.'],
  ['ض','Dad','ض','Dad','Sad with a dot above.'],
  ['ط','Ta (emphatic)','ط','Ta (emphatic)','A loop with a tall stem.'],
  ['ظ','Zha','ظ','Zha','Ta with a dot above.'],
  ['غ','Ghayn','غ','Ghayn','Ayn with a dot above.'],
  ['ف','Fa','ف','Fa','A loop with one dot above.'],
  ['ق','Qaf','ق','Qaf','A loop with two dots, deep tail.'],
  ['ك','Kaf','ك','Kaf','A stem and a slanted bar.'],
  ['ن','Nun','ن','Nun','A deep bowl with a dot above.'],
  ['ه','Ha (final)','ه','Ha (final)','A small closed knot.'],
  ['و','Waw','و','Waw','A round head with a curling tail.'],
  ['ي','Ya','ي','Ya','A long tail turning back, two dots beneath.']]},
 {n:2,ar:'المركّبات',en:'Al-Murakkabat',sub:'Short duas · letter joins',strict:false,fade:true,items:[
  ['لا','La','لَا','La','Lam-alif: the classic crossing join.'],
  ['الله','Allah','اللَّه','Allah','The name, with its shadda and standing alif.'],
  ['بسم الله','Bismillah','بِسْمِ اللَّهِ','In the name of God','The opening of every surah but one.'],
  ['الحمد لله','Alhamdulillah','الْحَمْدُ لِلَّهِ','Praise be to God','A phrase of gratitude.'],
  ['سبحان الله','Subhanallah','سُبْحَانَ اللَّهِ','Glory be to God','A phrase of wonder.'],
  ['الله أكبر','Allahu Akbar','اللَّهُ أَكْبَرُ','God is the Greatest','Two words, one balanced line.'],
  ['ما شاء الله','Masha’Allah','مَا شَاءَ اللَّهُ','As God willed','A phrase of appreciation.']]},
 {n:3,ar:'الحكم',en:'Al-Hikam',sub:'Wisdom & proverbs · rhythm and baseline',strict:false,fade:true,items:[
  ['الصبر مفتاح الفرج','Patience','الصَّبْرُ مِفْتَاحُ الْفَرَجِ','Patience is the key to relief','Traditional proverb.'],
  ['من جد وجد','Effort','مَنْ جَدَّ وَجَدَ','Whoever strives, finds','Traditional proverb.'],
  ['خير الكلام','Brevity','خَيْرُ الْكَلَامِ مَا قَلَّ وَدَلَّ','The best speech is brief and to the point','Traditional proverb.'],
  ['العلم نور','Knowledge','الْعِلْمُ نُورٌ','Knowledge is light','Traditional proverb.'],
  ['الوقت كالسيف','Time','الْوَقْتُ كَالسَّيْفِ','Time is like a sword','Traditional proverb.']]},
 {n:4,ar:'اللوحة',en:'Al-Lawha',sub:'Ayahs · composition, tashkeel, spacing',strict:false,fade:true,items:[
  ['قل هو الله أحد','Al-Ikhlas 112:1','قُلْ هُوَ اللَّهُ أَحَدٌ','Say: He is God, the One.','Qur’an 112:1'],
  ['الحمد لله رب العالمين','Al-Fatihah 1:2','الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ','All praise is for God, Lord of the worlds.','Qur’an 1:2'],
  ['إياك نعبد وإياك نستعين','Al-Fatihah 1:5','إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ','You alone we worship; You alone we ask for help.','Qur’an 1:5'],
  ['إن مع العسر يسرا','Ash-Sharh 94:6','إِنَّ مَعَ الْعُسْرِ يُسْرًا','Indeed, with hardship comes ease.','Qur’an 94:6 · standard orthography, verify against your mushaf'],
  ['فاذكروني أذكركم','Al-Baqarah 2:152','فَاذْكُرُونِي أَذْكُرْكُمْ','Remember Me; I will remember you.','Qur’an 2:152 · standard orthography, verify against your mushaf']]}
].map(t=>({...t,items:t.items.map((r,i)=>({id:'t'+t.n+'-'+(i+1),tier:t.n,title:r[0],name:r[1],text:r[2],meaning:r[3],note:r[4],angle:r[5]||0,extra:t.n===1&&i>=8}))}));
const SP_ALL=SP_TIERS.flatMap(t=>t.items),spItem=id=>SP_ALL.find(i=>i.id===id);

/* ---------- state ---------- */
function spBlank(){return{version:1,items:{},lawha:{},unlocked:{}};}
function spLoad(){try{const v=JSON.parse(localStorage.getItem(SP_KEY));if(v&&v.version===1&&v.items&&typeof v.items==='object')return{version:1,items:v.items,lawha:v.lawha&&typeof v.lawha==='object'?v.lawha:{},unlocked:v.unlocked&&typeof v.unlocked==='object'?v.unlocked:{}};}catch{}return spBlank();}
let spS=null;const spGet=()=>spS||(spS=spLoad());
function spSave(){try{localStorage.setItem(SP_KEY,JSON.stringify(spS));}catch{}}
const spIt=id=>spGet().items[id]||{best:0,stars:0,attempts:0,seal:false,done:false,last:0};
const spCoreGap=after=>{if(spGet().unlocked[2])return null;const core=SP_TIERS[0].items.filter(i=>!i.extra),k=after?core.findIndex(i=>i.id===after):-1;for(let j=1;j<=core.length;j++){const c=core[(k+j)%core.length];if(c.id!==after&&spIt(c.id).best<SP_UNLOCK)return c;}return null;};
const spAvg=n=>{const t=SP_TIERS[n-1],core=t.items.filter(i=>!i.extra);return Math.round(core.reduce((a,i)=>a+spIt(i.id).best,0)/core.length);};
const spStarsOf=s=>SP_STAR.filter(v=>s>=v).length;
function spRefreshUnlocks(){const s=spGet();for(let n=2;n<=4;n++)if(!s.unlocked[n]&&spAvg(n-1)>=SP_UNLOCK)s.unlocked[n]=true;}
const spOpen=n=>n===1||!!spGet().unlocked[n];
const spGuide=(item,att)=>!SP_TIERS[item.tier-1].fade?1:att<2?1:att<4?.5:0;
const spTrack=n=>window.dispatchEvent(new CustomEvent('khatti:track',{detail:n}));
const spAward=(id,xp)=>{if(xp>0)window.dispatchEvent(new CustomEvent('khatti:award',{detail:{id,xp:Math.min(100,xp)}}));};

/* ---------- layout, masks, scoring ---------- */
let spFontP=null;const spFont=t=>{try{return document.fonts?document.fonts.load('48px HarfNaskh',t||'ا').catch(()=>0):Promise.resolve();}catch{return Promise.resolve();}};
function spLayout(text,tier){
 const c=document.createElement('canvas').getContext('2d'),words=text.split(' '),max=tier===1?440:tier===2?270:230;
 for(let s=max;s>=40;s-=6){c.font=s+'px HarfNaskh, serif';const maxW=SP_W*.86,lines=[];let cur='';let bad=false;
  for(const w of words){const t=cur?cur+' '+w:w;if(cur&&c.measureText(t).width>maxW){lines.push(cur);cur=w;}else cur=t;if(c.measureText(w).width>maxW)bad=true;}
  lines.push(cur);if(bad||(lines.length===1?s*1.2:lines.length*s*1.5)>SP_H*.88)continue;
  return{size:s,lines:lines.map((t,i)=>({t,y:SP_H/2+(i-(lines.length-1)/2)*s*1.5}))};}
 return{size:40,lines:[{t:text,y:SP_H/2}]};}
function spDrawText(x,L,fill){x.font=L.size+'px HarfNaskh, serif';x.fillStyle=fill;x.textAlign='center';x.textBaseline='alphabetic';x.direction='rtl';L.lines.forEach(l=>x.fillText(l.t,SP_W/2,l.y+L.size*.22));}
const spNib=L=>Math.max(13,Math.min(34,L.size*.095));
function spMask(draw){const w=SP_W*SP_MS,h=SP_H*SP_MS,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.scale(SP_MS,SP_MS);draw(x);const d=x.getImageData(0,0,w,h).data,m=new Uint8Array(w*h);for(let i=0;i<m.length;i++)m[i]=d[i*4+3]>80?1:0;return{m,w,h};}
function spDilate(M,r){const{m,w,h}=M,t=new Uint8Array(w*h),o=new Uint8Array(w*h);
 for(let y=0;y<h;y++){let c=0;const p=new Int32Array(w+1);for(let x=0;x<w;x++)p[x+1]=p[x]+m[y*w+x];for(let x=0;x<w;x++)t[y*w+x]=p[Math.min(w,x+r+1)]-p[Math.max(0,x-r)]>0?1:0;}
 for(let x=0;x<w;x++){const p=new Int32Array(h+1);for(let y=0;y<h;y++)p[y+1]=p[y]+t[y*w+x];for(let y=0;y<h;y++)o[y*w+x]=p[Math.min(h,y+r+1)]-p[Math.max(0,y-r)]>0?1:0;}
 return{m:o,w,h};}
function spBox(M){let a=1e9,b=1e9,c=-1,d=-1,n=0;for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(M.m[y*M.w+x]){n++;if(x<a)a=x;if(x>c)c=x;if(y<b)b=y;if(y>d)d=y;}return n?{x0:a/SP_MS,y0:b/SP_MS,x1:c/SP_MS,y1:d/SP_MS,n}:null;}
function spAxis(M){let n=0,mx=0,my=0;for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(M.m[y*M.w+x]){n++;mx+=x;my+=y;}if(n<5)return 0;mx/=n;my/=n;let sxx=0,syy=0,sxy=0;for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(M.m[y*M.w+x]){const dx=x-mx,dy=y-my;sxx+=dx*dx;syy+=dy*dy;sxy+=dx*dy;}return .5*Math.atan2(2*sxy,sxx-syy)*180/Math.PI;}
const spTargetCache={};
function spTarget(item){const k=item.id+'@'+SP_W;if(!spTargetCache[k]){const L=spLayout(item.text,item.tier),M=spMask(x=>spDrawText(x,L,'#000'));spTargetCache[k]={L,M,box:spBox(M)};}return spTargetCache[k];}
function spInkPaint(x,strokes,nib,tf){x.save();if(tf){x.translate(tf.x,tf.y);x.scale(tf.s,tf.s);}strokes.forEach(s=>atNib(x,s,'#000',nib));x.restore();}
/** Score ink strokes (design units) against the item's model. attempt = 0-based attempt number (>=4 → freehand recall). */
function spScore(item,strokes,attempt){
 const T=spTarget(item),tier=SP_TIERS[item.tier-1],recall=tier.fade&&attempt>=4,nib=spNib(T.L);
 const pts=strokes.flat();if(!pts.length||!T.box)return{acc:0,cov:0,prec:0,prop:0,ang:null,empty:true};
 let a=1e9,b=1e9,c=-1e9,d=-1e9;pts.forEach(p=>{a=Math.min(a,p.x);c=Math.max(c,p.x);b=Math.min(b,p.y);d=Math.max(d,p.y);});
 const iw=Math.max(c-a,1),ih=Math.max(d-b,1),tw=T.box.x1-T.box.x0,th=T.box.y1-T.box.y0;
 let tf=null;if(recall){const s=Math.min(tw/iw,th/ih);tf={s,x:(T.box.x0+T.box.x1)/2-s*(a+c)/2,y:(T.box.y0+T.box.y1)/2-s*(b+d)/2};}
 const I=spMask(x=>spInkPaint(x,strokes,recall&&tf?nib/tf.s:nib,tf)),r=tier.strict?SP_CFG.r1:recall?SP_CFG.rr:SP_CFG.r,Id=spDilate(I,r),Td=spDilate(T.M,r);
 let tn=0,tc=0,inn=0,ip=0;for(let i=0;i<T.M.m.length;i++){if(T.M.m[i]){tn++;if(Id.m[i])tc++;}if(I.m[i]){inn++;if(Td.m[i])ip++;}}
 const cov=tn?tc/tn:0,prec=inn?ip/inn:0,F=cov+prec?2*cov*prec/(cov+prec):0,base=Math.max(0,Math.min(1,(F-SP_CFG.lo)/(SP_CFG.hi-SP_CFG.lo)));
 const prop=Math.max(0,Math.min(1,1-Math.abs(Math.log((iw/ih)/(tw/th)))/.8));
 let ang=null,mult;
 if(item.angle){let df=Math.abs(spAxis(I)-90);df=Math.min(df,180-df);ang=Math.max(0,Math.min(1,1-df/25));mult=.7+.15*prop+.15*ang;}
 else mult=tier.strict?.8+.2*prop:.85+.15*prop;
 return{acc:Math.round(base*mult*100),cov:Math.round(cov*100),prec:Math.round(prec*100),prop:Math.round(prop*100),ang:ang===null?null:Math.round(ang*100),recall};}

/* ---------- parchment map (Scroll of Mastery) ---------- */
let spMap=null;
const spEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const spStarsHtml=n=>'<span class="sp-stars" aria-label="'+n+' of 3 stars">'+[0,1,2].map(i=>'<i class="'+(i<n?'on':'')+'">★</i>').join('')+'</span>';
function spMapHtml(){spRefreshUnlocks();const s=spGet();
 return '<div class="sp-scroll"><nav class="sp-topbar"><button type="button" data-sp-nav="home">← Home</button><button type="button" data-sp-nav="work">My work</button></nav><header class="sp-title"><span lang="ar" dir="rtl">طريق الخطاط</span><h2>The Scribe’s Path</h2><p>Four tiers from single letters to full ayahs. Reach an average of '+SP_UNLOCK+'% in a tier to open the next (in Tier 1, the first 8 letters).</p></header>'+
 SP_TIERS.map(t=>{const open=spOpen(t.n),avg=spAvg(t.n),stars=t.items.reduce((a,i)=>a+spIt(i.id).stars,0),max=t.items.length*3,prev=t.n>1?spAvg(t.n-1):0;
  return '<section class="sp-tier'+(open?'':' locked')+'" data-tier="'+t.n+'" aria-label="Tier '+t.n+' '+t.en+'"><div class="sp-tcard"><div class="sp-tn" lang="ar" dir="rtl">'+t.ar+'</div><div><h3>Tier '+t.n+' · '+t.en+'</h3><p>'+t.sub+'</p></div><div class="sp-tstat"><span>'+(open?avg+'% avg':'🔒')+'</span><span>★ '+stars+'/'+max+'</span></div>'+
  '<div class="sp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+(open?avg:0)+'"><i style="width:'+(open?avg:0)+'%"></i><b style="left:'+SP_UNLOCK+'%"></b></div>'+
  (open?'':'<p class="sp-hint">Locked · reach '+SP_UNLOCK+'% average in '+SP_TIERS[t.n-2].en+(t.n===2?' (first 8 letters)':'')+' (now '+prev+'%).</p>')+'</div>'+
  '<ol class="sp-trail">'+(t.n===2?'<li class="sp-node sp-lesson'+(spJoinsDone()?' done':'')+'"><span class="sp-mark" aria-hidden="true">'+(spJoinsDone()?'<em class="sp-seal gold">خط</em>':'<em class="sp-dot"></em>')+'</span><button type="button" class="sp-quote" data-sp-joins '+(open?'':'disabled aria-disabled="true"')+'><span class="sp-ar" lang="ar" dir="rtl">بـ ـسـ ـم</span><span class="sp-en">Joins · Build بسم from its three joining forms</span><span class="sp-row"><span class="sp-best">'+(spJoinsDone()?'✓ Done · practise again':'Start here · lesson')+'</span></span></button></li>':'')+t.items.map((it,k)=>{const st=spIt(it.id),law=s.lawha[it.id];
   return (it.extra&&!t.items[k-1].extra?'<li class="sp-sep" role="presentation"><span>The full alphabet<small>Practice only · not needed to unlock Tier 2</small></span></li>':'')+'<li class="sp-node'+(st.done?' done':'')+(k%2?' alt':'')+'"><span class="sp-mark" aria-hidden="true">'+(st.done?'<em class="sp-seal'+(st.stars===3?' gold':'')+'">خط</em>':open?'<em class="sp-dot"></em>':'<em class="sp-lock">🔒</em>')+'</span>'+
   '<button type="button" class="sp-quote" data-sp-item="'+it.id+'" '+(open?'':'disabled aria-disabled="true"')+'><span class="sp-ar" lang="ar" dir="rtl">'+spEsc(it.text)+'</span><span class="sp-en">'+spEsc(it.name)+(it.tier>1?' · '+spEsc(it.meaning):'')+'</span><span class="sp-row">'+spStarsHtml(st.stars)+(st.seal?'<span class="sp-ms" title="Memory Seal: written from memory">ختم الذاكرة</span>':'')+(st.best?'<span class="sp-best">'+st.best+'%</span>':'')+'</span></button>'+
   (law?'<button type="button" class="sp-lawha-btn" data-sp-plate="'+it.id+'">Lawha ✦</button>':'')+'</li>';}).join('')+'</ol></section>';}).join('')+'</div>';}
function spShowMap(){spTrack('path_open');spHist('path');
 if(!spMap){spMap=document.createElement('div');spMap.id='scribe-path';spMap.setAttribute('role','dialog');spMap.setAttribute('aria-modal','true');spMap.setAttribute('aria-label','The Scribe’s Path');document.body.appendChild(spMap);
  spMap.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.spNav){const to=b.dataset.spNav;if(to==='path')return;spHideMap();spHistBack('path');const t=to==='work'?'[data-action="my-work"]':'[data-creative="'+to+'"]';document.querySelector(to==='work'?'.creative-header [data-action="my-work"]':'.creative-header [data-creative="home"]')?.click();}else if(b.hasAttribute('data-sp-joins')){spHideMap();window.__spJoinsReturn=1;spHist('joins');window.dispatchEvent(new CustomEvent('khatti:track',{detail:'path_joins'}));window.dispatchEvent(new Event('harf:open-connected'));}else if(b.hasAttribute('data-sp-studio'))spHideMap();else if(b.dataset.spItem)spPractice(b.dataset.spItem);else if(b.dataset.spPlate)spPlate(b.dataset.spPlate);});
  spMap.addEventListener('keydown',e=>{if(e.key==='Escape')spHideMap();});}
 spMap.innerHTML=spMapHtml();spMap.hidden=false;document.body.classList.add('sp-open');const f=spMap.querySelector('.sp-quote:not([disabled])');(f||spMap.querySelector('button')).focus({preventScroll:true});}
function spHideMap(){if(spMap)spMap.hidden=true;document.body.classList.remove('sp-open');}
const spRefresh=()=>{if(spMap&&!spMap.hidden){const y=spMap.querySelector('.sp-scroll')?.scrollTop||0;spMap.innerHTML=spMapHtml();const sc=spMap.querySelector('.sp-scroll');if(sc)sc.scrollTop=y;}};

/* ---------- practice ---------- */
let spP=null;
window.khattiNext=()=>{let started=false,next=spCoreGap();for(const t of SP_TIERS){if(!spOpen(t.n))continue;for(const it of t.items){const st=spIt(it.id);if(st.attempts>0)started=true;if(!next&&!st.done)next=it;}}return{started,id:next&&next.id,name:next&&next.name};};
document.addEventListener('click',e=>{const b=e.target.closest('[data-path-continue]');if(!b)return;e.preventDefault();spTrack('path_continue');spPractice(b.dataset.pathContinue);});
function spPractice(id){
 const item=spItem(id);if(!item||!spOpen(item.tier))return;spFont(item.text).then(()=>spPracticeRun(item));}
function spPracticeRun(item){
 if(spP)spP.close();
 spSetDims(window.innerHeight>window.innerWidth*1.15);
 const tier=SP_TIERS[item.tier-1],T=spTarget(item),nib=spNib(T.L),d=Math.min(2,window.devicePixelRatio||1);
 const ov=document.createElement('div');ov.id='scribe-practice';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Practice '+item.name);
 ov.innerHTML='<div class="sp-phead"><button type="button" class="sp-x" data-k="close" aria-label="Back to the map">‹</button><div><small>Tier '+item.tier+' · '+tier.en+'</small><h2>'+spEsc(item.name)+'</h2></div><span class="sp-att" aria-live="polite"></span></div>'+
 '<p class="sp-note">'+spEsc(item.note)+'</p>'+
 '<div class="sp-stage" style="aspect-ratio:'+SP_W+'/'+SP_H+';width:min(100%,calc((100dvh - 215px)*'+SP_W/SP_H+'))"><canvas class="sp-c bg" width="'+SP_W*d+'" height="'+SP_H*d+'"></canvas><canvas class="sp-c gh" width="'+SP_W*d+'" height="'+SP_H*d+'"></canvas><canvas class="sp-c ink" width="'+SP_W*d+'" height="'+SP_H*d+'" aria-label="Writing surface"></canvas></div>'+
 '<div class="sp-tools"><button type="button" data-k="undo">Undo</button><button type="button" data-k="clear">Clear</button>'+(tier.fade?'<button type="button" data-k="peek" aria-pressed="false">Peek</button>':'')+'<button type="button" class="go" data-k="check">Check</button></div>'+
 '<div class="sp-result" hidden></div>';
 document.body.appendChild(ov);
 const $=s=>ov.querySelector(s),bg=$('.bg').getContext('2d'),gh=$('.gh').getContext('2d'),ik=$('.ink'),ix=ik.getContext('2d');
 let strokes=[],cur=null,peek=false,peeked=false,res=null,t0=0;
 const attempt=()=>spIt(item.id).attempts,gl=()=>peek?Math.max(.35,spGuide(item,attempt())):spGuide(item,attempt());
 function drawBg(){bg.setTransform(d,0,0,d,0,0);bg.clearRect(0,0,SP_W,SP_H);bg.fillStyle='#fbf5e4';bg.fillRect(0,0,SP_W,SP_H);
  bg.strokeStyle='rgba(140,100,40,.16)';bg.lineWidth=1.2;
  if(tier.strict){for(let x=0;x<=SP_W;x+=50){bg.beginPath();bg.moveTo(x,0);bg.lineTo(x,SP_H);bg.stroke();}for(let y=0;y<=SP_H;y+=50){bg.beginPath();bg.moveTo(0,y);bg.lineTo(SP_W,y);bg.stroke();}bg.strokeStyle='rgba(140,60,30,.35)';bg.beginPath();bg.moveTo(SP_W/2,0);bg.lineTo(SP_W/2,SP_H);bg.moveTo(0,SP_H/2);bg.lineTo(SP_W,SP_H/2);bg.stroke();}
  else T.L.lines.forEach(l=>{const y=l.y+T.L.size*.22;bg.setLineDash([6,8]);bg.beginPath();bg.moveTo(40,y);bg.lineTo(SP_W-40,y);bg.stroke();bg.setLineDash([]);bg.beginPath();bg.moveTo(40,y-T.L.size*.5);bg.lineTo(SP_W-40,y-T.L.size*.5);bg.globalAlpha=.5;bg.stroke();bg.globalAlpha=1;});}
 function drawGhost(){gh.setTransform(d,0,0,d,0,0);gh.clearRect(0,0,SP_W,SP_H);const g=gl();if(g>0){gh.globalAlpha=g*.55;spDrawText(gh,T.L,'#1d6a52');gh.globalAlpha=1;}
  $('.sp-att').textContent=(tier.fade?'Guide '+Math.round(spGuide(item,attempt())*100)+'% · ':'')+'Attempt '+(attempt()+1);}
 function drawInk(){ix.setTransform(d,0,0,d,0,0);ix.clearRect(0,0,SP_W,SP_H);const all=cur?strokes.concat([atSmooth(cur)]):strokes;ix.fillStyle='#17231d';all.forEach(s=>atNib(ix,s,'#17231d',nib));}
 const pos=e=>{const r=ik.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*SP_W,y:(e.clientY-r.top)/r.height*SP_H};};
 const snap=p=>{if(!tier.strict)return p;const g=25,sx=Math.round(p.x/g)*g,sy=Math.round(p.y/g)*g;return Math.hypot(sx-p.x,sy-p.y)<10?{...p,x:sx,y:sy}:p;};
 ik.style.touchAction='none';
 ik.addEventListener('pointerdown',e=>{if(res)return;e.preventDefault();ik.setPointerCapture(e.pointerId);t0=e.timeStamp;cur=[snap({...pos(e),p:e.pointerType==='pen'?e.pressure:0,v:.4})];drawInk();});
 ik.addEventListener('pointermove',e=>{if(!cur)return;e.preventDefault();const ev=(e.getCoalescedEvents?e.getCoalescedEvents():[]);(ev.length?ev:[e]).forEach(q=>{const p=pos(q),l=cur[cur.length-1];if(Math.hypot(p.x-l.x,p.y-l.y)>1.5)cur.push({...p,p:q.pointerType==='pen'?q.pressure:0,v:.4});});drawInk();});
 const end=e=>{if(!cur)return;if(cur.length>0){cur[cur.length-1]=snap(cur[cur.length-1]);strokes.push(atSmooth(cur));}cur=null;drawInk();};
 ik.addEventListener('pointerup',end);ik.addEventListener('pointercancel',()=>{cur=null;drawInk();});
 function check(){if(!strokes.length){const n=$('.sp-note');n.textContent='Write something first, then press Check.';return;}
  const att=attempt(),r=spScore(item,strokes,att),before=spIt(item.id),s=spGet(),st={...before};
  const stars=spStarsOf(r.acc),recall=tier.fade&&att>=4,sealNow=recall&&!peeked&&r.acc>=SP_SEAL_MIN&&!before.seal;
  st.attempts=att+1;st.last=r.acc;st.best=Math.max(before.best,r.acc);const ns=spStarsOf(st.best);let xp=Math.max(0,(ns-before.stars))*10;st.stars=ns;st.done=ns>=1;if(sealNow){st.seal=true;xp+=40;}
  s.items[item.id]=st;spTrack('path_attempt');if(sealNow)spTrack('path_seal');
  if(item.tier===4&&r.acc>=SP_LAWHA){const prev=s.lawha[item.id];if(!prev||r.acc>=prev.score)s.lawha[item.id]={score:r.acc,date:new Date().toISOString().slice(0,10),theme:prev?.theme||'parchment',ink:prev?.ink||'ink',nib:Math.round(nib),strokes:spPack(strokes)};spTrack('lawha_claimed');}
  const wasLocked=[2,3,4].filter(n=>!s.unlocked[n]);spRefreshUnlocks();const opened=wasLocked.filter(n=>s.unlocked[n]);spSave();if(xp)spAward('path-'+item.id,xp);
  res={r,stars,sealNow,opened,xp,recall};showResult();spRefresh();drawGhost();}
 function showResult(){const{r,stars,sealNow,opened,xp}=res,P=$('.sp-result'),next=(item.tier===1&&spCoreGap(item.id))||SP_ALL[SP_ALL.indexOf(item)+1],nx=next&&spOpen(next.tier)?next:null,law=item.tier===4&&r.acc>=SP_LAWHA;
  P.hidden=false;P.innerHTML='<div class="sp-card" role="status">'+(stars>=1?'<div class="sp-stamp'+(stars===3?' gold':'')+'" aria-hidden="true">خط</div>':'')+'<div class="sp-pct">'+r.acc+'<small>%</small></div>'+spStarsHtml(stars)+
  '<p class="sp-detail">Coverage '+r.cov+'% · Precision '+r.prec+'% · Proportion '+r.prop+'%'+(r.ang!==null?' · Angle '+r.ang+'%':'')+'</p>'+
  (stars===0?'<p class="sp-msg">Not yet — trace the guide slowly and keep the whole shape in view.</p>':'')+
  (sealNow?'<p class="sp-msg seal"><em class="sp-seal">ختم</em> Memory Seal — written from memory! +40 XP</p>':'')+
  (opened.length?'<p class="sp-msg seal">🔓 Tier '+opened[0]+' · '+SP_TIERS[opened[0]-1].en+' is open.</p>':'')+
  (xp&&!sealNow?'<p class="sp-msg">+'+xp+' XP</p>':'')+
  (tier.fade&&attempt()<5?'<p class="sp-sub">The guide fades as you practise: it is '+Math.round(spGuide(item,attempt())*100)+'% next time.</p>':'')+
  '<div class="sp-acts"><button type="button" data-k="retry">Try again</button>'+(law?'<button type="button" class="gold" data-k="lawha">Claim Lawha ✦</button>':'')+(nx?'<button type="button" class="go" data-k="next">Next →</button>':'')+'<button type="button" data-k="close">Map</button></div></div>';
  (P.querySelector('.go')||P.querySelector('button')).focus();}
 function reset(){strokes=[];cur=null;res=null;peek=false;peeked=false;const pk=$('[data-k=peek]');if(pk)pk.setAttribute('aria-pressed','false');$('.sp-result').hidden=true;$('.sp-note').textContent=item.note;drawGhost();drawInk();}
 function close(){document.removeEventListener('keydown',kd);window.removeEventListener('resize',rs);ov.remove();spP=null;spSetDims(false);spRefresh();if(!spMap||spMap.hidden){try{if(history.state&&history.state.sp==='practice')history.replaceState({sp:'path'},'');}catch{}spShowMap();}}
 const rs=()=>{const portrait=window.innerHeight>window.innerWidth*1.15;if((portrait?640:1000)!==SP_W&&!strokes.length&&!res){close();spPracticeRun(item);}};window.addEventListener('resize',rs);
 const kd=e=>{if(e.key==='Escape'){close();}};document.addEventListener('keydown',kd);
 ov.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;
  if(k==='close'){close();spHistBack('practice');}else if(k==='undo'){strokes.pop();drawInk();}else if(k==='clear'){strokes=[];drawInk();}
  else if(k==='peek'){peek=!peek;if(peek)peeked=true;b.setAttribute('aria-pressed',String(peek));drawGhost();}
  else if(k==='check')check();else if(k==='retry')reset();
  else if(k==='next'){const n=(item.tier===1&&spCoreGap(item.id))||SP_ALL[SP_ALL.indexOf(item)+1];close();if(n)spPractice(n.id);}
  else if(k==='lawha'){close();spPlate(item.id);}});
 spHist('practice');spP={close,item,get strokes(){return strokes;},set strokes(v){strokes=v;drawInk();},check};
 drawBg();drawGhost();drawInk();ov.querySelector('.go').focus({preventScroll:true});}

/* ---------- Lawha plate ---------- */
const spPack=strokes=>{let n=0;const out=[];for(const s of strokes){if(out.length>=60)break;const r=[];let l=null;for(const p of s){if(!l||Math.hypot(p.x-l.x,p.y-l.y)>=9){r.push([Math.round(p.x),Math.round(p.y)]);l=p;}}const e=s[s.length-1];if(e&&l!==e)r.push([Math.round(e.x),Math.round(e.y)]);if(n+r.length>3500)break;n+=r.length;out.push(r);}return out;};
const SP_INKS={ink:'Ink',gold:'Gold foil'};
function spCompose(item,law,W,H){
 const T=AT_THEMES[law.theme]||AT_THEMES.parchment,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),u=W/1400;
 atPaper(x,W,H,T,u);const m=.04*W,rect=i=>()=>{x.beginPath();x.rect(m+i,m+i,W-2*m-2*i,H-2*m-2*i);};
 atFoilLine(x,rect(0),9*u,u,W,H);x.strokeStyle=T.txt;x.globalAlpha=.8;x.lineWidth=2*u;rect(15*u)();x.stroke();x.globalAlpha=1;atFoilLine(x,rect(24*u),2.5*u,u,W,H);
 const st=law.strokes.map(s=>s.map(q=>({x:q[0],y:q[1],v:.4})));let a=1e9,b=1e9,e=-1e9,f=-1e9;st.flat().forEach(p=>{a=Math.min(a,p.x);e=Math.max(e,p.x);b=Math.min(b,p.y);f=Math.max(f,p.y);});
 const bw=Math.max(e-a,1),bh=Math.max(f-b,1),bx=W*.14,by=H*.14,bW=W*.72,bH=H*.5,k=Math.min(bW/bw,bH/bh),ox=W/2-k*(a+e)/2,oy=by+bH/2-k*(b+f)/2;
 x.save();x.translate(ox,oy);x.scale(k,k);const nib=(law.nib||26)*(law.ink==='gold'?1:1);
 if(law.ink==='gold'){x.restore();x.save();st.forEach(s=>{const path=()=>{x.beginPath();s.forEach((p,i)=>{const X=ox+k*p.x,Y=oy+k*p.y;i?x.lineTo(X,Y):x.moveTo(X,Y);});};atFoilLine(x,path,nib*k*.55,u,W,H);});x.restore();}
 else{st.forEach(s=>atNib(x,s,T.ink,nib));x.restore();}
 x.textAlign='center';x.fillStyle=T.txt;x.textBaseline='alphabetic';x.direction='rtl';x.font=Math.round(46*u)+'px HarfNaskh, serif';x.globalAlpha=.9;x.fillText(item.text,W/2,H*.76);x.globalAlpha=1;
 x.direction='ltr';x.fillStyle=T.sub;x.font='italic '+Math.round(26*u)+'px Georgia, serif';x.fillText(item.meaning,W/2,H*.82);
 x.font=Math.round(20*u)+'px Georgia, serif';x.fillText('Lawha · '+item.name+' · '+law.score+'% · '+law.date,W/2,H*.87);x.globalAlpha=.7;x.font='italic '+Math.round(18*u)+'px Georgia, serif';x.fillText('qariai.app/khatti',W/2,H*.915);x.globalAlpha=1;stampSignature(x,W,H,T.txt);return c;}
let spPl=null;
function spPlate(id){
 const item=spItem(id),s=spGet(),law=s.lawha[id];if(!item||!law)return;spFont(item.text).then(()=>{
 if(spPl)spPl.remove();const ov=document.createElement('div');spPl=ov;ov.id='scribe-plate';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Lawha plate');
 ov.innerHTML='<div class="sp-phead"><button type="button" class="sp-x" data-k="close" aria-label="Close">‹</button><div><small>Al-Lawha</small><h2>Your plate</h2></div></div><div class="sp-frame"><canvas width="1400" height="1000"></canvas></div>'+
 '<div class="sp-ctl"><div role="group" aria-label="Background texture">'+Object.entries(AT_THEMES).map(([k,v])=>'<button type="button" data-th="'+k+'" aria-pressed="'+(law.theme===k)+'">'+v.name+'</button>').join('')+'</div><div role="group" aria-label="Ink">'+Object.entries(SP_INKS).map(([k,v])=>'<button type="button" data-ink="'+k+'" aria-pressed="'+(law.ink===k)+'">'+v+'</button>').join('')+'</div><button type="button" data-k="share">Share</button><button type="button" class="go" data-k="save">Save PNG</button></div>';
 document.body.appendChild(ov);const cv=ov.querySelector('canvas');
 const paint=()=>{const c=spCompose(item,law,1400,1000);cv.getContext('2d').clearRect(0,0,1400,1000);cv.getContext('2d').drawImage(c,0,0);};paint();
 const close=()=>{document.removeEventListener('keydown',kd);ov.remove();spPl=null;};const kd=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',kd);
 ov.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.k==='close')close();
  else if(b.dataset.th){law.theme=b.dataset.th;spSave();ov.querySelectorAll('[data-th]').forEach(q=>q.setAttribute('aria-pressed',String(q===b)));paint();}
  else if(b.dataset.ink){law.ink=b.dataset.ink;spSave();ov.querySelectorAll('[data-ink]').forEach(q=>q.setAttribute('aria-pressed',String(q===b)));paint();}
  else if(b.dataset.k==='share'){const c=spCompose(item,law,2000,1429);c.toBlob(async bl=>{if(!bl)return;const f=new File([bl],'khatti-lawha-'+id+'.png',{type:'image/png'}),d={files:[f],title:'My Lawha · Khatti',text:item.name+' — written with Khatti by QariAI · qariai.app/khatti'};try{if(navigator.canShare&&navigator.canShare(d)){await navigator.share(d);spTrack('lawha_shared');return;}}catch(err){if(err&&err.name==='AbortError')return;}b.textContent='Use Save PNG';setTimeout(()=>b.textContent='Share',2200);});}
  else if(b.dataset.k==='save'){spTrack('lawha_saved');const c=spCompose(item,law,3000,2143);c.toBlob(bl=>{if(!bl)return;const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='khatti-lawha-'+id+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);});}});
 ov.querySelector('.go').focus({preventScroll:true});});}

export function installPath(){
 if(typeof document==='undefined'||window.__khattiPath)return;
 window.addEventListener('khatti:open-path',()=>spShowMap());
 document.addEventListener('click',e=>{const b=e.target.closest('[data-path]');if(b){e.preventDefault();document.getElementById('creative-sheet')?.close?.();spShowMap();}});
 window.__khattiPath={cfg:SP_CFG,tiers:SP_TIERS,items:SP_ALL,get state(){return spGet();},reset(){spS=spBlank();spSave();spRefresh();},score:(id,strokes,att)=>spScore(spItem(id),strokes,att||0),
  /** dots sampled from the model glyph (for tests): a perfect "tracing" */
  dots(id){const T=spTarget(spItem(id)),o=[];for(let y=0;y<T.M.h;y+=2)for(let x=0;x<T.M.w;x+=2)if(T.M.m[y*T.M.w+x])o.push([{x:(x+.5)/SP_MS,y:(y+.5)/SP_MS,v:.4}]);return o;},
  /** pen centre-line of the model glyph (Zhang-Suen thinning, traced into polylines): lets tests simulate attempts of known quality */
  core(id){const T=spTarget(spItem(id)),{w,h}=T.M,g=Uint8Array.from(T.M.m),at=(x,y)=>x<0||y<0||x>=w||y>=h?0:g[y*w+x];
   for(let ch=1;ch;){ch=0;for(let pass=0;pass<2;pass++){const del=[];for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(!g[y*w+x])continue;const n=[at(x,y-1),at(x+1,y-1),at(x+1,y),at(x+1,y+1),at(x,y+1),at(x-1,y+1),at(x-1,y),at(x-1,y-1)],B=n.reduce((a,b)=>a+b,0);if(B<2||B>6)continue;let A=0;for(let k=0;k<8;k++)if(!n[k]&&n[(k+1)%8])A++;if(A!==1)continue;if(pass===0?(n[0]&&n[2]&&n[4])||(n[2]&&n[4]&&n[6]):(n[0]&&n[2]&&n[6])||(n[0]&&n[4]&&n[6]))continue;del.push(y*w+x);}del.forEach(k=>g[k]=0);if(del.length)ch=1;}}
   const pts=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(g[y*w+x])pts.push({x,y,u:0});const key=(x,y)=>x+','+y,map=new Map(pts.map(q=>[key(q.x,q.y),q])),nb=q=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const r=map.get(key(q.x+dx,q.y+dy));if(r&&!r.u)return r;}return null;},out=[];
   for(const q of pts){if(q.u)continue;q.u=1;const ch=[q];let c=q,nx;while((nx=nb(c))){nx.u=1;ch.push(nx);c=nx;}c=q;while((nx=nb(c))){nx.u=1;ch.unshift(nx);c=nx;}if(ch.length>=2)out.push(ch.map(r=>({x:(r.x+.5)/SP_MS,y:(r.y+.5)/SP_MS,v:.4})));}
   return out;},
  get practice(){return spP;},refresh:spRefresh};
}
export function pathSummary(){const s=spGet();return{done:SP_ALL.filter(i=>spIt(i.id).done).length,total:SP_ALL.length,stars:SP_ALL.reduce((a,i)=>a+spIt(i.id).stars,0)};}
if(typeof document!=='undefined')installPath();

window.addEventListener('harf:section-enter',e=>{if(e.detail==='home'&&window.__spJoinsReturn&&!document.querySelector('#connected-studio')){window.__spJoinsReturn=0;spHistBack('joins');setTimeout(()=>window.dispatchEvent(new Event('khatti:open-path')),0);}});

const SP_JOINS_KEY='khatti.joins.v1';function spJoinsDone(){try{return !!JSON.parse(localStorage.getItem(SP_JOINS_KEY))?.done;}catch{return false;}}
window.addEventListener('khatti:joins-done',()=>{try{localStorage.setItem(SP_JOINS_KEY,JSON.stringify({done:true,at:Date.now()}));}catch{}window.dispatchEvent(new CustomEvent('khatti:track',{detail:'path_joins_done'}));window.__spJoinsToast=1;});
window.addEventListener('khatti:open-path',()=>{if(!window.__spJoinsToast)return;window.__spJoinsToast=0;setTimeout(()=>{const n=document.querySelector('#scribe-path .sp-lesson');if(!n)return;n.scrollIntoView({block:'center'});const t=document.createElement('li');t.className='sp-toast';t.setAttribute('role','status');t.textContent='Joins done ✦ Now write them in phrases: start with لا';n.after(t);setTimeout(()=>t.remove(),4200);},60);});
try{if(new URLSearchParams(location.search).get('unlock')==='all'){const s=spGet();s.unlocked={...s.unlocked,2:true,3:true,4:true};spSave();}}catch{}

function spHist(k){try{const cur=history.state&&history.state.sp;if(cur===k)return;if(k==='practice'&&cur==='practice')history.replaceState({sp:k},'');else history.pushState({sp:k},'');}catch{}}
function spHistBack(k){try{if(history.state&&history.state.sp===k){window.__spSilentPop=1;history.back();}}catch{}}
window.addEventListener('popstate',e=>{if(window.__spSilentPop){window.__spSilentPop=0;return;}const st=e.state&&e.state.sp;
 if(spP){spP.close();return;}
 const cs=document.querySelector('#connected-studio');if(cs&&window.__spJoinsReturn){cs.querySelector('[data-connected="close"]')?.click();return;}
 if(st!=='path'&&spMap&&!spMap.hidden)spHideMap();});

document.addEventListener('click',e=>{const b=e.target.closest('[data-sp-goto]');if(!b)return;const n=b.dataset.spGoto;setTimeout(()=>{const t=document.querySelector('#scribe-path .sp-tier[data-tier="'+n+'"]');if(!t)return;t.scrollIntoView({block:'start',behavior:'smooth'});t.classList.add('sp-flash');setTimeout(()=>t.classList.remove('sp-flash'),1600);},120);});
