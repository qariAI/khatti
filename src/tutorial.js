/* Khatti guided tutorial — "Draw the Kaf (ك) in four steps".
   Spotlight overlay + live practice canvas. Letter geometry: centre-line of the real Noto Naskh Arabic kaf
   (tools/extract-guides.py), scaled to the 1000×560 design space. The swash is a decorative extension.
   State: khatti.tutorial.v1 {version:1, seen, completed, step, badge, runs}  — replay any time from the ☰ menu. */
import {atParse,atLen,atResample,atSmooth,atNib,atNear,atFoil} from './atelier.js';

const TU_KEY='khatti.tutorial.v1';
const TU_RAW=['M574.7,31.6 L566.6,50.6 L564.8,82.0 L571.1,145.9 L587.3,257.6 L589.1,274.6 L588.2,292.6 L566.6,307.1 L514.4,311.6 L443.3,311.6 L419.0,309.8 L401.9,306.1','M499.1,163.9 L488.3,159.4 L482.9,159.4 L477.5,162.2 L465.8,172.0 L459.5,185.5 L460.4,192.8 L464.9,196.3 L499.1,203.6 L500.0,209.8 L497.3,215.2 L488.3,223.3 L473.0,232.3 L459.5,236.8 L447.8,235.1'];
const tuMap=p=>({x:(p.x-500)*1.4+500,y:(p.y-170)*1.4+260});
const TU_MAIN=atParse(TU_RAW[0]).map(tuMap),TU_MARK=atParse(TU_RAW[1]).map(tuMap);
/* split the main stroke at the corner where the stem turns into the base */
const TU_CORNER=(()=>{let k=0,bx=-1;for(let i=0;i<TU_MAIN.length;i++){if(TU_MAIN[i].y>bx){bx=TU_MAIN[i].y;k=i;}}return k;})();
const TU_STEM=atResample(TU_MAIN.slice(0,TU_CORNER+1),4);
const TU_BASE=atResample(TU_MAIN.slice(TU_CORNER),4);
const TU_END=TU_BASE[TU_BASE.length-1];
/* decorative terminal loop + swash extending the base (not part of the letter) */
const TU_SWASH=atResample(atParse('M'+TU_END.x.toFixed(1)+','+TU_END.y.toFixed(1)+' C'+(TU_END.x-34).toFixed(1)+','+(TU_END.y+2).toFixed(1)+' '+(TU_END.x-72).toFixed(1)+','+(TU_END.y-14).toFixed(1)+' '+(TU_END.x-72).toFixed(1)+','+(TU_END.y-46).toFixed(1)+' C'+(TU_END.x-72).toFixed(1)+','+(TU_END.y-74).toFixed(1)+' '+(TU_END.x-32).toFixed(1)+','+(TU_END.y-80).toFixed(1)+' '+(TU_END.x-24).toFixed(1)+','+(TU_END.y-56).toFixed(1)+' C'+(TU_END.x-18).toFixed(1)+','+(TU_END.y-38).toFixed(1)+' '+(TU_END.x-42).toFixed(1)+','+(TU_END.y-30).toFixed(1)+' '+(TU_END.x-56).toFixed(1)+','+(TU_END.y-38).toFixed(1)),4);
const TU_MARKR=atResample(TU_MARK,4);
const TU_LINES=[{y:TU_STEM[0].y-6,name:'Ascender line'},{y:(TU_MARKR[0].y+TU_MARKR[TU_MARKR.length-1].y)/2-22,name:'Body height'},{y:TU_BASE.reduce((a,p)=>Math.max(a,p.y),0),name:'Baseline'}];
const TU_STEPS=[
 {id:'guides',title:'1 · Set your guidelines',text:'Establish your workspace and reference lines for consistent spacing: an ascender line, a body-height line and a baseline. Trace along the baseline to try it.',targets:[atResample([{x:140,y:TU_LINES[2].y},{x:860,y:TU_LINES[2].y}],6)],focus:{x:110,y:TU_LINES[0].y-30,w:780,h:TU_LINES[2].y-TU_LINES[0].y+60},kind:'lines'},
 {id:'stem',title:'2 · The primary stem',text:'Pull your stroke downward with a confident, steady motion, following the arrow. Keep the nib at 45° and let the stem lean slightly.',targets:[TU_STEM],kind:'ghost'},
 {id:'swash',zoom:true,title:'3 · Terminals & swashes',text:'Turn at the baseline and glide left, then curve outward and loop gracefully to form the terminal. Add the inner mark last. The swash is an optional flourish.',targets:[TU_BASE,TU_MARKR,TU_SWASH],kind:'ghost'},
 {id:'weight',title:'4 · Thick & thin',text:'Refine your lines and check stroke weighting. Thin strokes come from moving along the nib, thick strokes from moving across it. Retrace the whole letter and watch the weight change.',targets:[TU_STEM,TU_BASE,TU_MARKR,TU_SWASH],kind:'weight'}
];
function tuRead(){try{const v=JSON.parse(localStorage.getItem(TU_KEY));if(v&&v.version===1)return v;}catch{}return{version:1,seen:false,completed:false,step:0,badge:'',runs:0};}
function tuWrite(v){try{localStorage.setItem(TU_KEY,JSON.stringify(v));}catch{}}
export function tutorialSummary(){const v=tuRead();return{completed:v.completed,badge:v.badge,runs:v.runs};}
const tuBuzz=p=>{try{navigator.vibrate&&navigator.vibrate(p);}catch{}};

export function installTutorial(){
 if(typeof document==='undefined'||window.__khattiTutorial)return;window.__khattiTutorial=true;
 let ov,S,raf=0,ro,prev;const $=s=>ov.querySelector(s);
 const bbox=(subs,pad)=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const s of subs)for(const p of s){a=Math.min(a,p.x);b=Math.min(b,p.y);c=Math.max(c,p.x);d=Math.max(d,p.y);}return{x:a-pad,y:b-pad,w:c-a+2*pad,h:d-b+2*pad};};
 const focusOf=st=>st.focus||bbox(st.targets,46);
 window.__khattiTutorial={steps:TU_STEPS.map(s=>s.targets),state:()=>S&&{i:S.i,ok:S.ok.slice()},map:(x,y)=>{const t=tf();return{x:t.x+x*t.k,y:t.y+y*t.k};}};
 function open(){if(ov)return;prev=document.activeElement;const v=tuRead();v.step=0;
  S={i:0,ok:[false,false,false,false],strokes:[],live:null,t0:performance.now(),w:0,h:0,s:1,ox:0,oy:0,fx:[],fo:null,done:false,v:{k:1,cx:500,cy:280},vt:{k:1,cx:500,cy:280}};
  ov=document.createElement('div');ov.id='tutorial';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-labelledby','tu-title');
  ov.innerHTML='<header class="tu-head"><div class="tu-ttl"><small>GUIDED TUTORIAL</small><h2>Draw the Kaf <span lang="ar" dir="rtl">ك</span></h2></div><button class="tu-skip" data-tu="skip">Skip</button></header><div class="tu-dots" aria-hidden="true"></div><div class="tu-stage"><canvas aria-label="Practice canvas. Draw with touch, mouse or stylus."></canvas></div><section class="tu-card" aria-live="polite"><h3 id="tu-title"></h3><p class="tu-text"></p><p class="tu-state"></p><div class="tu-nav"><button data-tu="back">Back</button><button data-tu="demo">↻ Demo</button><button data-tu="clear">Clear</button><button class="tu-next" data-tu="next">Next</button></div></section><div class="tu-reward" hidden role="status"></div>';
  document.body.append(ov);document.body.classList.add('dr-lock');
  ov.addEventListener('click',onClick);ov.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();skip();}else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);});
  const c=$('canvas');c.addEventListener('pointerdown',pDown);c.addEventListener('pointermove',pMove);c.addEventListener('pointerup',pUp);c.addEventListener('pointercancel',pUp);
  ro=new ResizeObserver(size);ro.observe($('.tu-stage'));v.seen=true;v.runs=(v.runs||0)+1;tuWrite(v);
  size();ui();focusTo();$('.tu-next').focus();
  const tick=()=>{raf=requestAnimationFrame(tick);draw();};tick();}
 function close(){if(!ov)return;cancelAnimationFrame(raf);ro?.disconnect();ov.remove();ov=null;S=null;document.body.classList.remove('dr-lock');document.querySelectorAll('[data-tutorial-badge]').forEach(b=>{const t=tutorialSummary();b.textContent=t.completed?'✓ '+(t.badge||'Done'):'New';});prev?.focus?.();}
 function skip(){const v=tuRead();v.step=S?S.i:0;tuWrite(v);close();}
 function size(){if(!ov)return;const st=$('.tu-stage'),c=$('canvas'),r=st.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);S.w=Math.max(220,Math.floor(r.width));S.h=Math.max(180,Math.floor(r.height));c.style.width=S.w+'px';c.style.height=S.h+'px';c.width=S.w*d;c.height=S.h*d;S.d=d;S.s=Math.min(S.w/1000,S.h/560)*.96;S.ox=(S.w-1000*S.s)/2;S.oy=(S.h-560*S.s)/2;}
 const tf=()=>{const v=S.v,k=S.s*v.k;return{k,x:S.w/2-v.cx*k,y:S.h/2-v.cy*k};};
 function focusTo(){const st=TU_STEPS[S.i],f=st.zoom?bbox([TU_SWASH],42):focusOf(st);S.fo=S.fo||{...f};S.ft=f;S.vt=st.zoom?{k:1.7,cx:f.x+f.w/2+60,cy:f.y+f.h/2}:{k:1,cx:500,cy:280};}
 function ui(){const st=TU_STEPS[S.i];$('#tu-title').textContent=st.title;$('.tu-text').textContent=st.text;
  $('.tu-dots').innerHTML=TU_STEPS.map((s,i)=>'<span class="'+(i===S.i?'now':i<S.i||S.ok[i]?'done':'')+'"></span>').join('');
  $('.tu-state').textContent=S.ok[S.i]?'✓ Practised — nicely done.':'Try it on the canvas (optional), then continue.';
  $('[data-tu=back]').disabled=S.i===0;$('.tu-next').textContent=S.i===TU_STEPS.length-1?'Finish ✦':'Next';}
 function go(n){const j=S.i+n;if(j<0)return;if(j>=TU_STEPS.length){finish();return;}S.i=j;S.strokes=[];S.live=null;S.t0=performance.now();ui();focusTo();const v=tuRead();v.step=j;tuWrite(v);}
 function onClick(e){const b=e.target.closest('[data-tu]');if(!b||b.disabled)return;const a=b.dataset.tu;if(a==='next')go(1);else if(a==='back')go(-1);else if(a==='skip')skip();else if(a==='demo')S.t0=performance.now();else if(a==='clear'){S.strokes=[];S.live=null;}else if(a==='done')close();else if(a==='again'){S.done=false;S.i=0;S.ok=[false,false,false,false];S.strokes=[];$('.tu-reward').hidden=true;ui();focusTo();S.t0=performance.now();}}
 /* ---- gamification ---- */
 function finish(){const all=S.ok.every(Boolean),v=tuRead(),first=!v.completed;v.completed=true;if(first)window.dispatchEvent(new CustomEvent('khatti:award',{detail:{id:'tutorial',xp:all?35:25}}));v.badge=all?'Kaf Apprentice ★':'Kaf Apprentice';v.step=0;tuWrite(v);S.done=true;tuBuzz([10,30,10,30,20]);
  for(let k=0;k<5;k++)setTimeout(()=>S&&S.fx.push({x:300+Math.random()*400,y:140+Math.random()*260,t:performance.now()}),k*140);
  const r=$('.tu-reward');r.hidden=false;r.innerHTML='<div class="tu-badge" aria-hidden="true">ك</div><strong>'+(first?'Tutorial complete!':'Tutorial replayed')+'</strong><span>Badge earned: <b>'+v.badge+'</b>'+(all?' · all four steps practised':'')+'</span>'+(first?'<span class="tu-xp">+'+(all?35:25)+' XP</span>':'')+'<div class="tu-ra"><button data-tu="again">Replay</button><button class="tu-next" data-tu="done">Continue</button></div>';r.focus?.();}
 /* ---- practice capture ---- */
 const toD=e=>{const r=$('canvas').getBoundingClientRect(),t=tf();return{x:(e.clientX-r.left-t.x)/t.k,y:(e.clientY-r.top-t.y)/t.k,t:performance.now(),p:e.pointerType==='pen'?e.pressure:0,v:0};};
 function pDown(e){if(S.done)return;e.preventDefault();e.currentTarget.setPointerCapture?.(e.pointerId);S.live=[toD(e)];}
 function pMove(e){if(!S.live)return;const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const ev of evs.length?evs:[e]){const q=toD(ev),l=S.live[S.live.length-1],d=Math.hypot(q.x-l.x,q.y-l.y);if(d<1.2)continue;q.v=d*S.s/Math.max(1,q.t-l.t);S.live.push(q);}}
 function pUp(){if(!S.live)return;const raw=S.live;S.live=null;if(raw.length<2)return;S.strokes.push(atSmooth(raw));check();}
 function check(){if(S.ok[S.i])return;const st=TU_STEPS[S.i],G=st.targets.flat(),U=S.strokes.flat(),gl=st.targets.reduce((a,p)=>a+atLen(p),0),ul=S.strokes.reduce((a,p)=>a+atLen(p),0);if(ul<gl*.5)return;
  const prec=U.filter(p=>atNear(p,G)[0]<46).length/U.length,cov=G.filter(g=>atNear(g,U)[0]<56).length/G.length;
  if(prec>=.55&&cov>=.6){S.ok[S.i]=true;const e=U[U.length-1];S.fx.push({x:e.x,y:e.y,t:performance.now()});tuBuzz(14);ui();}}
 /* ---- drawing ---- */
 function ghost(x,subs,e,col){const lens=subs.map(atLen),total=lens.reduce((a,b)=>a+b,0);let target=e*total,head=null,ang=0;
  for(let k=0;k<subs.length;k++){const sp=subs[k],use=Math.max(0,Math.min(lens[k],target));target-=lens[k];if(use<=0)continue;let acc=0,part=[sp[0]];for(let i=1;i<sp.length;i++){const sl=Math.hypot(sp[i].x-sp[i-1].x,sp[i].y-sp[i-1].y);if(acc+sl>use){const f=(use-acc)/sl;part.push({x:sp[i-1].x+(sp[i].x-sp[i-1].x)*f,y:sp[i-1].y+(sp[i].y-sp[i-1].y)*f});break;}acc+=sl;part.push(sp[i]);}
   atNib(x,part.map(p=>({...p,v:.3})),col);head=part[part.length-1];if(part.length>1){const a=part[part.length-2];ang=Math.atan2(head.y-a.y,head.x-a.x);}}
  if(head){x.save();x.translate(head.x,head.y);x.rotate(-Math.PI/4);x.fillStyle='#17231d';x.fillRect(-15,-3,30,6);x.restore();x.save();x.translate(head.x,head.y);x.setLineDash([3,4]);x.strokeStyle='#a8841f';x.lineWidth=1.6;x.beginPath();x.moveTo(-50*.707,50*.707);x.lineTo(50*.707,-50*.707);x.stroke();x.setLineDash([]);x.rotate(ang);x.fillStyle='#b3122b';x.beginPath();x.moveTo(26,0);x.lineTo(10,-9);x.lineTo(10,9);x.closePath();x.fill();x.restore();}}
 function weightMarks(x){const P=[...TU_STEM,...TU_BASE.slice(1)];let hi={f:-1},lo={f:9};for(let i=6;i<P.length-6;i+=1){const a=P[i-3],b=P[i+3],dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1,f=Math.abs(Math.cos(Math.PI/4)*dy+Math.sin(Math.PI/4)*dx)/n;if(f>hi.f)hi={f,p:P[i]};if(f<lo.f)lo={f,p:P[i]};}
  const tag=(p,txt,col,dx,dy)=>{x.save();x.strokeStyle=col;x.fillStyle=col;x.lineWidth=2;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+dx,p.y+dy);x.stroke();x.beginPath();x.arc(p.x,p.y,6,0,7);x.fill();x.font='700 24px system-ui';x.textAlign=dx<0?'right':'left';x.fillText(txt,p.x+dx+(dx<0?-8:8),p.y+dy+8);x.restore();};
  tag(hi.p,'THICK · across the nib','#b3122b',-70,-30);tag(lo.p,'THIN · along the nib','#1d5a9a',70,50);}
 function alphaLayer(x,alpha,fn){const c=x.canvas;let o=S.off;if(!o||o.width!==c.width||o.height!==c.height){o=S.off=document.createElement('canvas');o.width=c.width;o.height=c.height;}const g=o.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,o.width,o.height);g.setTransform(x.getTransform());g.lineCap=g.lineJoin='round';fn(g);x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=alpha;x.drawImage(o,0,0);x.restore();}
 function draw(){if(!ov)return;const c=$('canvas'),x=c.getContext('2d'),now=performance.now(),d=S.d||1,st=TU_STEPS[S.i],t=(now-S.t0)/1000;
  x.setTransform(1,0,0,1,0,0);const g=x.createLinearGradient(0,0,0,S.h*d);g.addColorStop(0,'#fbf5e4');g.addColorStop(1,'#efe3c3');x.fillStyle=g;x.fillRect(0,0,S.w*d,S.h*d);
  for(const q of['k','cx','cy'])S.v[q]+=(S.vt[q]-S.v[q])*.12;const T=tf();x.setTransform(d*T.k,0,0,d*T.k,T.x*d,T.y*d);x.lineCap=x.lineJoin='round';
  /* guidelines (always faintly visible, bold in step 1) */
  TU_LINES.forEach((L,i)=>{const bold=S.i===0,prog=bold?Math.min(1,Math.max(0,(t-i*.55)/.7)):1;x.strokeStyle=bold?'#a8841f':'rgba(168,132,31,.4)';x.lineWidth=bold?3:1.6;x.setLineDash(bold?[]:[6,8]);x.beginPath();x.moveTo(110,L.y);x.lineTo(110+780*prog,L.y);x.stroke();x.setLineDash([]);if(bold&&prog>.2){x.fillStyle='#6b5a1e';x.font='600 22px system-ui';x.textAlign='left';x.fillText(L.name,118,L.y-10);}});
  /* faint pencil outline of what is being taught */
  if(st.kind!=='lines'){x.strokeStyle='rgba(90,90,90,.35)';x.lineWidth=2;x.setLineDash([5,7]);for(const sub of st.targets){x.beginPath();sub.forEach((p,k)=>k?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();}x.setLineDash([]);}
  /* earlier steps already learned, shown in ink */
  if(S.i>0&&S.i<3){const prior=TU_STEPS.slice(0,S.i).flatMap(s=>s.kind==='lines'?[]:s.targets);alphaLayer(x,.55,g=>{for(const sub of prior)atNib(g,sub.map(p=>({...p,v:.25})),'#17231d');});}
  /* demo */
  if(st.kind==='ghost'){const e=Math.min(1,(t%7)/3.4);alphaLayer(x,.65,g=>ghost(g,st.targets,e,'#d4af37'));}
  if(st.kind==='weight'){const e=Math.min(1,(t%9)/3.6);alphaLayer(x,.92,g=>{for(const sub of st.targets)atNib(g,sub.map(p=>({...p,v:.2})),'#17231d');});if(t>3.4)weightMarks(x);if(e<1)alphaLayer(x,.5,g=>ghost(g,st.targets,e,'#d4af37'));}
  /* user strokes */
  for(const s of S.strokes)atNib(x,s,'#17231d');if(S.live&&S.live.length>1)alphaLayer(x,.92,g=>atNib(g,atSmooth(S.live),'#17231d'));
  /* success ripples */
  S.fx=S.fx.filter(f=>now-f.t<900);for(const f of S.fx){const a=(now-f.t)/900;for(const k of[0,.25]){const aa=a-k;if(aa<=0)continue;x.strokeStyle='rgba(232,190,70,'+(.8*(1-aa)).toFixed(3)+')';x.lineWidth=5*(1-aa)+1;x.beginPath();x.arc(f.x,f.y,14+aa*100,0,7);x.stroke();}}
  /* spotlight veil with soft glowing cut-out (eases between steps) */
  const F=S.fo,FT=S.ft;if(F&&FT){for(const k of['x','y','w','h'])F[k]+=(FT[k]-F[k])*.14;}
  x.setTransform(d,0,0,d,0,0);x.fillStyle='rgba(8,24,16,'+(S.done?.0:.5)+')';
  if(!S.done){const sx=T.x+F.x*T.k,sy=T.y+F.y*T.k,sw=F.w*T.k,sh=F.h*T.k,r=18;x.beginPath();x.rect(0,0,S.w,S.h);x.roundRect?x.roundRect(sx,sy,sw,sh,r):x.rect(sx,sy,sw,sh);x.fill('evenodd');
   x.strokeStyle='rgba(232,190,70,'+(.55+.3*Math.sin(now/300)).toFixed(2)+')';x.lineWidth=2.4;x.beginPath();x.roundRect?x.roundRect(sx,sy,sw,sh,r):x.rect(sx,sy,sw,sh);x.stroke();}}
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-tutorial]');if(b&&!ov){e.preventDefault();open();}});
 window.addEventListener('khatti:open-tutorial',open);
 /* First Playground visit: offer the tutorial once (never when intros are switched off, never again after it has been opened). */
 let offered=false;
 window.addEventListener('khatti:playground-shown',()=>{if(offered||ov)return;let pref=null;try{pref=localStorage.getItem('harf.intros.auto.v1');}catch{}if(pref==='false')return;const v=tuRead();if(v.seen||v.completed)return;offered=true;let tries=0;const t=setInterval(()=>{tries++;if(ov||tries>25||!document.getElementById('creative-studio')){clearInterval(t);return;}if(document.querySelector('dialog[open]'))return;clearInterval(t);if(!tuRead().seen)open();},500);});
}
if(typeof document!=='undefined')installTutorial();
