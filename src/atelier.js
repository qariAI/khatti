import {stampSignature} from './signature.js';
/* Khatti Atelier — Learn step-by-step → generate a finished calligraphy composition.
   Pipeline: level → atomic steps → ghost demo (45° broad nib) → capture → smooth (resample + Chaikin)
   → broad-nib vector strokes → composition (gold/ink border, shadow, gradient ink) → PNG / poster.
   Stroke guides are centre-lines traced from the real Noto Naskh Arabic letterforms bundled with the app (SIL OFL),
   shaped with HarfBuzz and skeletonised offline (see tools/extract-guides.py). They are correct letter shapes but
   still a Naskh skeleton drawn with a 45° nib; a calligrapher should review before calling it Thuluth.
   Storage: khatti.atelier.v1 {version:1, levels:{"13":{count:n}}} */
const AT_KEY='khatti.atelier.v1';
const AT_DW=1000,AT_DH=560,AT_NIBLEN=30;let AT_NIB=Math.PI/4;
const AT_LEVELS=[
 {id:13,title:"Allahu Akbar",ar:"الله أكبر",steps:[
  {name:"Alif",subs:['M908.3,113.3 L903.1,123.0 L900.5,133.4 L903.8,229.9 L903.8,315.4 L903.1,319.3 L897.3,327.1']},
  {name:"Lam",subs:['M835.1,113.3 L825.3,138.6 L835.1,255.2 L836.4,282.4 L834.4,300.5 L821.5,312.2 L802.0,316.7 L798.1,321.3']},
  {name:"Lam",subs:['M758.3,113.3 L748.6,138.6 L756.4,308.3','M793.3,322.6 L788.1,316.1 L758.9,308.3 L724.6,316.1 L720.7,320.0']},
  {name:"Ha",subs:['M669.6,227.3 L652.1,230.6 L622.3,246.8 L603.5,264.9 L600.2,279.1 L600.9,283.7 L610.0,290.8 L637.8,301.2 L648.8,302.5 L667.0,293.4 L676.7,293.4','M680.6,192.3 L669.6,218.3 L678.0,301.2 L689.0,310.9 L707.1,315.4 L713.0,321.3']},
  {name:"Alif",subs:['M465.2,113.3 L460.1,123.0 L457.5,133.4 L460.7,229.9 L460.7,315.4 L460.1,319.3 L454.2,327.1','M472.0,55.3 L468.7,45.0 L462.3,41.1 L452.6,42.4 L442.8,49.5 L438.3,56.6 L438.3,65.7 L450.0,72.2 L454.5,77.4']},
  {name:"Kaf",subs:['M407.9,122.7 L404.6,130.5 L396.2,137.0 L315.2,172.6 L301.0,179.7 L293.2,188.1 L293.2,202.4 L309.4,212.1 L327.5,216.6 L353.4,233.5 L376.1,256.2 L386.5,276.2 L383.9,291.8 L374.2,299.6 L359.9,306.7 L327.5,314.5 L295.1,317.0']},
  {name:"Ba",subs:['M286.1,324.2 L278.3,315.7 L262.1,312.5 L245.3,303.4 L237.5,301.5','M232.2,364.9 L251.7,384.3']},
  {name:"Ra",subs:['M166.2,312.2 L161.7,316.7 L158.5,329.7 L149.4,349.1 L142.3,359.5 L126.7,373.1 L116.4,378.3 L100.8,382.1 L74.3,378.3 L61.9,373.7','M143.6,220.9 L139.7,229.3 L137.1,243.5 L161.1,303.8 L166.2,312.2 L183.7,314.8 L190.2,322.6']}]},
 {id:16,title:"Muhammad ﷺ",cap:"Muhammad · peace be upon him",ar:"محمد ﷺ",steps:[
  {name:"Mim",subs:['M794.6,289.7 L799.0,265.2 L820.9,225.7 L831.4,214.4 L841.0,207.4 L854.1,203.0 L863.8,202.1 L874.3,205.6 L879.6,210.9 L890.1,229.3 L896.2,245.0 L903.2,279.2 L901.5,295.8 L897.1,308.1 L884.8,312.5 L872.5,311.6 L838.4,304.6 L802.5,290.6 L793.7,289.7 L780.6,295.0 L773.5,302.0 L763.9,307.2 L751.6,310.7 L745.5,318.6']},
  {name:"Ha",subs:['M735.9,316.9 L728.9,311.6 L691.2,308.1 L673.7,303.7 L663.2,298.5 L651.8,287.1 L648.3,281.8 L645.6,266.9 L634.3,256.4 L628.1,245.9 L601.8,231.9 L575.6,213.5 L555.4,203.8 L525.6,200.3 L502.0,205.6 L488.8,217.0 L484.4,229.3','M712.2,244.1 L681.6,258.2 L638.6,255.5 L622.0,270.4 L608.9,274.8 L566.8,295.0 L537.9,304.6 L510.7,309.9 L461.7,313.4']},
  {name:"Mim",subs:['M416.6,297.6 L413.9,285.3 L400.8,259.9 L385.9,209.1 L380.6,203.8 L370.1,199.5 L357.9,203.0 L343.0,213.5 L323.7,232.8 L308.8,254.7 L304.4,276.6 L313.2,299.3','M416.6,297.6 L409.5,303.7 L406.0,303.7 L392.0,313.4 L367.5,310.7 L344.7,303.7 L313.2,299.3','M313.2,299.3 L306.2,306.3 L279.9,311.6 L276.4,315.1','M448.1,321.2 L440.2,309.9 L416.6,297.6']},
  {name:"Dal",subs:['M184.4,158.3 L180.0,169.7 L178.3,188.1 L200.2,250.3 L214.2,275.7 L217.7,291.5 L227.3,295.0 L238.7,304.6 L260.6,311.6 L267.6,321.2','M217.7,291.5 L211.6,297.6 L206.3,297.6 L181.8,306.3 L155.5,310.7 L124.8,312.5 L102.9,309.0 L90.7,302.8 L86.3,298.5 L82.8,283.6']}]}
];
function atRead(){try{const v=JSON.parse(localStorage.getItem(AT_KEY));if(v&&v.version===1&&v.levels&&typeof v.levels==='object')return v;}catch{}return{version:1,levels:{}};}
function atWrite(v){try{localStorage.setItem(AT_KEY,JSON.stringify(v));}catch{}}
export function atelierSummary(){const v=atRead();return AT_LEVELS.map(l=>({id:l.id,title:l.title,count:(v.levels[l.id]&&v.levels[l.id].count)|0}));}

/* ---- geometry ---- */
export function atParse(d){const t=d.match(/[MLQC]|-?\d+\.?\d*/g),P=[];let i=0,cmd='',cur=null;const num=()=>parseFloat(t[i++]);
 while(i<t.length){if(/[MLQC]/.test(t[i]))cmd=t[i++];
  if(cmd==='M'||cmd==='L'){cur={x:num(),y:num()};P.push(cur);}
  else if(cmd==='Q'){const c={x:num(),y:num()},e={x:num(),y:num()};for(let k=1;k<=14;k++){const u=k/14,m=1-u;P.push({x:m*m*cur.x+2*m*u*c.x+u*u*e.x,y:m*m*cur.y+2*m*u*c.y+u*u*e.y});}cur=e;}
  else if(cmd==='C'){const a={x:num(),y:num()},b={x:num(),y:num()},e={x:num(),y:num()};for(let k=1;k<=18;k++){const u=k/18,m=1-u;P.push({x:m*m*m*cur.x+3*m*m*u*a.x+3*m*u*u*b.x+u*u*u*e.x,y:m*m*m*cur.y+3*m*m*u*a.y+3*m*u*u*b.y+u*u*u*e.y});}cur=e;}}
 return P;}
export const atLen=p=>{let s=0;for(let i=1;i<p.length;i++)s+=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y);return s;};
export function atResample(p,sp){if(p.length<2)return p.slice();const o=[p[0]];let acc=0;for(let i=1;i<p.length;i++){let a=o[o.length-1],b=p[i],d=Math.hypot(b.x-a.x,b.y-a.y);while(acc+d>=sp){const f=(sp-acc)/d,n={x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,v:((a.v??b.v??0)+(b.v??0))/2,p:a.p};o.push(n);a=n;d=Math.hypot(b.x-a.x,b.y-a.y);acc=0;}acc+=d;}
 const l=p[p.length-1];if(Math.hypot(l.x-o[o.length-1].x,l.y-o[o.length-1].y)>sp*.3)o.push(l);return o;}
function atChaikin(p,it=2){for(let k=0;k<it&&p.length>2;k++){const n=[p[0]];for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],v=(x,y)=>({x:x,y:y,v:((a.v||0)*.75+(b.v||0)*.25)});n.push({x:.75*a.x+.25*b.x,y:.75*a.y+.25*b.y,v:a.v||0,p:a.p},{x:.25*a.x+.75*b.x,y:.25*a.y+.75*b.y,v:b.v||0,p:b.p});}n.push(p[p.length-1]);p=n;}return p;}
/* shaky input → smooth calligraphic stroke (design units) */
function atRelax(p,n){for(let k=0;k<n;k++){const o=[p[0]];for(let i=1;i<p.length-1;i++)o.push({x:(p[i-1].x+2*p[i].x+p[i+1].x)/4,y:(p[i-1].y+2*p[i].y+p[i+1].y)/4,v:((p[i-1].v||0)+2*(p[i].v||0)+(p[i+1].v||0))/4,p:p[i].p});o.push(p[p.length-1]);p=o;}return p;}
export function atSmooth(raw){if(raw.length<2)return raw.slice();return atChaikin(atRelax(atResample(raw,7),6),2);}

/* shared by every drawing surface so tracing feels the same everywhere: smooth [x,y] point arrays (cached per stroke, pressure-aware) */
const atSmXY=new WeakMap();
export function atSmoothXYP(points,pressures){if(!points||points.length<3)return{points,pressures};const c=atSmXY.get(points);if(c&&c.n===points.length&&c.pn===(pressures?pressures.length:0))return c.v;
 const sm=atSmooth(points.map((q,i)=>({x:q[0],y:q[1],v:.4,p:pressures&&pressures[i]!=null?pressures[i]:undefined})));const v={points:sm.map(q=>[q.x,q.y]),pressures:pressures?sm.map(q=>q.p!=null?q.p:.5):undefined};atSmXY.set(points,{n:points.length,pn:pressures?pressures.length:0,v});return v;}
export const atSmoothXY=points=>atSmoothXYP(points).points;
function atWidth(pt){if(pt.p>0&&pt.p<=1)return .5+pt.p*.8;return Math.max(.5,Math.min(1.2,1.24-(pt.v||0)*.5));}
/* broad-nib sweep: each point is a 45° flat nib segment; consecutive segments form parallelograms */
export function atNib(x,pts,fill,nib=AT_NIBLEN,wmul=1){if(pts.length<2){if(pts[0]){x.beginPath();x.arc(pts[0].x,pts[0].y,nib*.18,0,7);x.fillStyle=fill;x.fill();}return;}
 x.fillStyle=fill;const cx=Math.cos(AT_NIB),cy=-Math.sin(AT_NIB),n=pts.length,ed=i=>Math.min(1,.3+Math.min(i,n-1-i)/(n*.1));
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],ha=nib*atWidth(a)*wmul*ed(i-1)/2,hb=nib*atWidth(b)*wmul*ed(i)/2;
  x.beginPath();x.moveTo(a.x-cx*ha,a.y-cy*ha);x.lineTo(a.x+cx*ha,a.y+cy*ha);x.lineTo(b.x+cx*hb,b.y+cy*hb);x.lineTo(b.x-cx*hb,b.y-cy*hb);x.closePath();x.fill();x.lineWidth=1.4;x.lineJoin='round';x.strokeStyle=fill;x.stroke();}
 x.lineWidth=nib*.1;x.lineCap='round';x.lineJoin='round';x.strokeStyle=fill;x.beginPath();pts.forEach((q,i)=>i?x.lineTo(q.x,q.y):x.moveTo(q.x,q.y));x.stroke();}
export const atNear=(p,G)=>{let m=1e9,k=0;for(let i=0;i<G.length;i++){const d=Math.hypot(p.x-G[i].x,p.y-G[i].y);if(d<m){m=d;k=i;}}return[m,k];};


/* ---- themes, foil, paper ---- */
export const AT_THEMES={
 parchment:{name:'Parchment',bg:['#fbf5e4','#efe3c3'],fiber:'120,90,40',ink:'#17231d',grad:['#1c1b1f','#123524','#0c2418'],txt:'#17231d',sub:'#8a6d1c'},
 sepia:{name:'Sepia',bg:['#ecdcb8','#cfb286'],fiber:'92,56,20',ink:'#3a2412',grad:['#4a2c14','#2e1a0b','#1c0f06'],txt:'#3a2412',sub:'#7a5a1c'},
 dark:{name:'Midnight',bg:['#17271f','#0a1410'],fiber:'212,175,55',ink:'#e8cb70',grad:null,txt:'#f1e2a8',sub:'#d2ad45'}
};
export function atFoil(x,x0,y0,x1,y1){const g=x.createLinearGradient(x0,y0,x1,y1);[[0,'#6f4f0f'],[.16,'#d9b64a'],[.3,'#fff2ae'],[.44,'#c79a2c'],[.58,'#8a6414'],[.72,'#f0d77a'],[.86,'#b8892a'],[1,'#7a5a12']].forEach(([o,c])=>g.addColorStop(o,c));return g;}
/* foil-stamped line: emboss shadow, foil body, specular highlight */
export function atFoilLine(x,path,lw,u,W,H){x.save();x.lineJoin=x.lineCap='round';
 x.save();x.translate(1.6*u,2.2*u);x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=lw;path();x.stroke();x.restore();
 x.strokeStyle=atFoil(x,0,0,W,H);x.lineWidth=lw;path();x.stroke();
 x.save();x.translate(-lw*.12,-lw*.14);x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=Math.max(1,lw*.24);path();x.stroke();x.restore();x.restore();}
export function atFoilText(x,txt,cx,cy,font,u,w){x.save();x.font=font;x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(0,0,0,.35)';x.fillText(txt,cx+1.4*u,cy+1.8*u);x.fillStyle=atFoil(x,cx-w/2,cy-30*u,cx+w/2,cy+30*u);x.fillText(txt,cx,cy);x.restore();}
export function atPaper(x,W,H,T,u,seed=7){const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,T.bg[0]);g.addColorStop(1,T.bg[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
 let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let i=0;i<8;i++){const cx=r()*W,cy=r()*H,rg=x.createRadialGradient(cx,cy,0,cx,cy,W*(.15+r()*.25));rg.addColorStop(0,'rgba('+T.fiber+',.07)');rg.addColorStop(1,'rgba('+T.fiber+',0)');x.fillStyle=rg;x.fillRect(0,0,W,H);}
 x.fillStyle='rgba('+T.fiber+',.06)';for(let i=0;i<W*H/1300;i++)x.fillRect(r()*W,r()*H,(.6+r()*1.6)*u,(.6+r()*1.6)*u);
 x.strokeStyle='rgba('+T.fiber+',.05)';x.lineWidth=u;for(let i=0;i<W*H/22000;i++){const a=r()*W,b=r()*H,l=(8+r()*26)*u,t=r()*6.28;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(t)*l,b+Math.sin(t)*l);x.stroke();}
 const v=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(40,25,5,'+(T===AT_THEMES.dark?.45:.18)+')');x.fillStyle=v;x.fillRect(0,0,W,H);}
const atPaperCache={};
function atPaperTex(T,key,w,h,d){const k=key+w+'x'+h+'@'+d;if(!atPaperCache[k]){const c=document.createElement('canvas');c.width=w*d;c.height=h*d;atPaper(c.getContext('2d'),w*d,h*d,T,d);atPaperCache[key+'last']=k;atPaperCache[k]=c;}return atPaperCache[k];}
const atBuzz=p=>{try{navigator.vibrate&&navigator.vibrate(p);}catch{}};

export function installAtelier(){
 if(typeof document==='undefined'||window.__khattiAtelier)return;
 let ov,S,raf=0,prevFocus,ro;const $=s=>ov.querySelector(s);
 const guideOf=(L,si)=>L.steps[si].subs.map(d=>atResample(atParse(d),4));
 const theme=()=>AT_THEMES[S.theme];
 window.__khattiAtelier={levels:AT_LEVELS,guide:(l,s)=>guideOf(AT_LEVELS.find(x=>x.id===l),s),map:(x,y)=>({x:S.ox+x*S.s,y:S.oy+y*S.s}),state:()=>S&&{step:S.step,done:S.done.length,ang:S.ang,theme:S.theme,stab:S.stab}};
 function thumb(i){const subs=guideOf(S.L,i),pts=subs.flat();let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const p of pts){a=Math.min(a,p.x);b=Math.min(b,p.y);c=Math.max(c,p.x);d=Math.max(d,p.y);}const pad=24,w=Math.max(60,c-a)+pad*2,h=Math.max(60,d-b)+pad*2;
  return '<svg class="at-th" viewBox="'+(a-pad)+' '+(b-pad)+' '+w+' '+h+'" aria-hidden="true" focusable="false">'+subs.map(s=>'<path d="M'+s.filter((_,k)=>k%3===0).map(p=>p.x.toFixed(0)+','+p.y.toFixed(0)).join(' L')+'" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>').join('')+'</svg>';}
 function open(id){const L=AT_LEVELS.find(l=>l.id===+id);if(ov||!L)return;prevFocus=document.activeElement;
  S={L,step:0,done:[],cur:[],live:null,msg:'',demo:null,w:0,h:0,s:1,ox:0,oy:0,result:false,shake:0,ang:45,stab:1,theme:'parchment',fx:[],popIdx:-1,brush:null};AT_NIB=Math.PI/4;
  ov=document.createElement('div');ov.id='atelier';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-labelledby','at-title');
  ov.innerHTML='<header class="at-head"><button class="at-x" data-at="close" aria-label="Close">×</button><div class="at-ttl"><small>STEP-BY-STEP MASTERPIECE</small><h2 id="at-title"></h2></div></header><div class="at-levels" role="group" aria-label="Choose a level"></div><div class="at-opts"></div><div class="at-steps" aria-label="Steps"></div><p class="at-msg" role="status" aria-live="polite"></p><div class="at-stage"><canvas aria-label="Calligraphy canvas. Draw with touch, mouse or stylus."></canvas></div><div class="at-tools"><button data-at="watch">▶ Watch</button><button data-at="redo">Redo step</button><button data-at="reset">Reset</button><button class="at-gen" data-at="gen" disabled>Generate Masterpiece</button></div><div class="at-final" hidden><canvas class="at-out" aria-label="Your finished composition"></canvas><div class="at-fa"><button class="at-gen" data-at="png">Download PNG</button><button data-at="poster">Poster PNG</button><button data-at="back">← Keep tracing</button></div></div>';
  document.body.append(ov);document.body.classList.add('dr-lock');
  ov.addEventListener('click',onClick);ov.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
  const c=$('.at-stage canvas');c.addEventListener('pointerdown',pDown);c.addEventListener('pointermove',pMove);c.addEventListener('pointerup',pUp);c.addEventListener('pointercancel',pUp);
  ro=new ResizeObserver(size);ro.observe($('.at-stage'));
  ui();size();startDemo();$('.at-x').focus();
  (document.fonts?.load?document.fonts.load('80px HarfNaskh','الله').catch(()=>{}):0);
  const tick=()=>{raf=requestAnimationFrame(tick);draw();};tick();}
 function close(){if(!ov)return;cancelAnimationFrame(raf);ro?.disconnect();ov.remove();ov=null;S=null;AT_NIB=Math.PI/4;document.body.classList.remove('dr-lock');const sm=atelierSummary();document.querySelectorAll('[data-atelier-badge]').forEach(b=>{const l=sm.find(x=>x.id===+b.dataset.atelierBadge);b.textContent=l&&l.count?'✓ '+l.count+'×':'New';});prevFocus?.focus?.();}
 const STAB=['Off','Low','Medium','High'],STABR=[0,10,22,36];
 function ui(){const sm=atelierSummary(),locked=S.done.length>0||S.cur.length>0;$('#at-title').textContent='Level '+S.L.id+' · '+S.L.title;
  $('.at-levels').innerHTML=AT_LEVELS.map(l=>'<button data-at="level" data-id="'+l.id+'" aria-pressed="'+(l.id===S.L.id)+'">Level '+l.id+'<small>'+l.title+(sm.find(x=>x.id===l.id).count?' ✓':'')+'</small></button>').join('');
  $('.at-opts').innerHTML='<span class="at-opt" role="group" aria-label="Nib angle"><button data-at="ang-" aria-label="Decrease nib angle"'+(locked?' disabled':'')+'>−</button><b>Nib '+S.ang+'°</b><button data-at="ang+" aria-label="Increase nib angle"'+(locked?' disabled':'')+'>+</button></span><button class="at-opt" data-at="stab" aria-label="Stroke stabilizer">Stabilizer: '+STAB[S.stab]+'</button><span class="at-opt" role="group" aria-label="Paper and ink">'+Object.entries(AT_THEMES).map(([k,t])=>'<button data-at="theme" data-v="'+k+'" aria-pressed="'+(k===S.theme)+'">'+t.name+'</button>').join('')+'</span>';
  $('.at-steps').innerHTML=S.L.steps.map((s,i)=>'<span class="'+(i<S.done.length?'done':i===S.step?'now':'')+(i===S.popIdx?' pop':'')+'"'+(i===S.step?' aria-current="step"':'')+'>'+thumb(i)+(i<S.done.length?'✓ ':i+1+' ')+s.name+'</span>').join('');
  $('.at-msg').textContent=S.msg||(S.step<S.L.steps.length?'Step '+(S.step+1)+' of '+S.L.steps.length+': '+S.L.steps[S.step].name+'. Watch the nib, then trace it.':'All steps complete. Generate your masterpiece.');
  $('[data-at=gen]').disabled=S.done.length<S.L.steps.length;}
 function size(){if(!ov)return;const st=$('.at-stage'),c=$('.at-stage canvas'),r=st.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);S.w=Math.max(220,Math.floor(r.width));S.h=Math.max(180,Math.floor(r.height));c.style.width=S.w+'px';c.style.height=S.h+'px';c.width=S.w*dpr;c.height=S.h*dpr;S.dpr=dpr;S.s=Math.min(S.w/AT_DW,S.h/AT_DH)*.96;S.ox=(S.w-AT_DW*S.s)/2;S.oy=(S.h-AT_DH*S.s)/2;}
 function startDemo(){if(S.step>=S.L.steps.length){S.demo=null;return;}const subs=guideOf(S.L,S.step);S.demo={subs,t0:performance.now(),len:subs.map(atLen),dur:Math.max(1400,Math.min(3600,subs.reduce((a,p)=>a+atLen(p),0)*3.6))};}
 function onClick(e){const b=e.target.closest('[data-at]');if(!b||b.disabled)return;const a=b.dataset.at;
  if(a==='close')close();
  else if(a==='level'){S.L=AT_LEVELS.find(l=>l.id===+b.dataset.id);resetLevel();}
  else if(a==='watch')startDemo();
  else if(a==='redo'){S.cur=[];S.live=null;S.msg='';ui();startDemo();}
  else if(a==='reset')resetLevel();
  else if(a==='ang-'||a==='ang+'){S.ang=Math.max(30,Math.min(60,S.ang+(a==='ang+'?5:-5)));AT_NIB=S.ang*Math.PI/180;ui();startDemo();}
  else if(a==='stab'){S.stab=(S.stab+1)%4;ui();}
  else if(a==='theme'){S.theme=b.dataset.v;ui();if(S.result)paintFinal();}
  else if(a==='gen')showFinal();
  else if(a==='back'){$('.at-final').hidden=true;$('.at-stage').hidden=false;$('.at-tools').hidden=false;S.result=false;}
  else if(a==='png')save(false);else if(a==='poster')save(true);}
 function resetLevel(){S.step=0;S.done=[];S.cur=[];S.live=null;S.msg='';S.result=false;S.fx=[];$('.at-final').hidden=true;$('.at-stage').hidden=false;$('.at-tools').hidden=false;ui();size();startDemo();}
 const toD=(e)=>{const r=$('.at-stage canvas').getBoundingClientRect();return{x:(e.clientX-r.left-S.ox)/S.s,y:(e.clientY-r.top-S.oy)/S.s,t:performance.now(),p:e.pointerType==='pen'?e.pressure:0,v:0};};
 function pDown(e){if(S.step>=S.L.steps.length||S.result)return;e.preventDefault();e.currentTarget.setPointerCapture?.(e.pointerId);S.demo=null;const p=toD(e);S.live=[p];S.brush={x:p.x,y:p.y};}
 function pMove(e){if(!S.live)return;const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e],r=STABR[S.stab];for(const ev of evs.length?evs:[e]){const q=toD(ev),B=S.brush;
   if(r>0){const d=Math.hypot(q.x-B.x,q.y-B.y);if(d>r){const f=(d-r)/d;B.x+=(q.x-B.x)*f;B.y+=(q.y-B.y)*f;}q.x=B.x;q.y=B.y;}
   const l=S.live[S.live.length-1],d2=Math.hypot(q.x-l.x,q.y-l.y);if(d2<1.2)continue;q.v=d2*S.s/Math.max(1,q.t-l.t);S.live.push(q);}}
 function pUp(){if(!S.live)return;const raw=S.live;S.live=null;if(raw.length<2)return;S.cur.push(atSmooth(raw));ui();evaluate();}
 function pulse(x,y){S.fx.push({x,y,t:performance.now()});}
 function evaluate(){const subs=guideOf(S.L,S.step),G=subs.flat(),U=S.cur.flat(),gl=subs.reduce((a,p)=>a+atLen(p),0),ul=S.cur.reduce((a,p)=>a+atLen(p),0);
  if(ul<gl*.55||S.cur.length<subs.length&&ul<gl*.95){S.msg=S.cur.length<subs.length?'Stroke '+S.cur.length+' of '+subs.length+' done. Keep going.':'Keep going — '+Math.round(ul/gl*100)+'% of the stroke.';ui();return;}
  const prec=U.filter(p=>atNear(p,G)[0]<44).length/U.length,cov=G.filter(g=>atNear(g,U)[0]<52).length/G.length;
  let dirOk=true;if(subs.length===1&&S.cur.length===1){const a=atNear(U[0],G)[1],b=atNear(U[U.length-1],G)[1];dirOk=b>a;}
  if(prec>=.62&&cov>=.7&&dirOk){const last=S.cur[S.cur.length-1],e=last[last.length-1];pulse(e.x,e.y);setTimeout(()=>S&&pulse(e.x,e.y),160);atBuzz(14);S.done.push(S.cur);S.cur=[];S.popIdx=S.step;S.step++;S.msg=S.step>=S.L.steps.length?'':'Beautiful. Next stroke.';ui();startDemo();setTimeout(()=>{if(S){S.popIdx=-1;}},700);}
  else{S.msg=!dirOk?'Right shape, wrong direction. Follow the arrow.':'Not quite on the line ('+Math.round(prec*100)+'% on, '+Math.round(cov*100)+'% covered). Try again.';S.cur=[];S.shake=performance.now();atBuzz([8,40,8]);ui();setTimeout(()=>{if(S&&!S.live)startDemo();},700);}}
 /* ---- live drawing ---- */
 function draw(){if(!ov||S.result)return;const c=$('.at-stage canvas'),x=c.getContext('2d'),now=performance.now(),d=S.dpr||1,T=theme();
  x.setTransform(1,0,0,1,0,0);x.drawImage(atPaperTex(T,S.theme,S.w,S.h,d),0,0);
  const sh=now-S.shake<350?Math.sin((now-S.shake)/18)*5:0;x.setTransform(d*S.s,0,0,d*S.s,(S.ox+sh)*d,S.oy*d);x.lineCap=x.lineJoin='round';
  const dk=S.theme==='dark';
  x.strokeStyle=dk?'rgba(230,215,160,.3)':'rgba(90,90,90,.35)';x.lineWidth=2.4/S.s;x.setLineDash([5,7]);
  S.L.steps.forEach((st,i)=>{if(i<S.done.length)return;for(const sub of guideOf(S.L,i)){x.beginPath();sub.forEach((p,k)=>k?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));if(i===S.step){x.save();x.strokeStyle=dk?'rgba(240,210,110,.95)':'rgba(168,132,31,.9)';x.lineWidth=4.2/S.s;x.stroke();x.restore();}else x.stroke();}});x.setLineDash([]);
  const ink=T.ink;for(const st of S.done)for(const s of st)atNib(x,s,ink);for(const s of S.cur)atNib(x,s,ink);
  if(S.live&&S.live.length>1)atNib(x,atSmooth(S.live),ink);
  /* success ripples */
  S.fx=S.fx.filter(f=>now-f.t<900);for(const f of S.fx){const a=(now-f.t)/900;for(const k of[0,.25]){const aa=a-k;if(aa<=0)continue;x.strokeStyle='rgba(232,190,70,'+(.75*(1-aa)).toFixed(3)+')';x.lineWidth=(5*(1-aa)+1)/1;x.beginPath();x.arc(f.x,f.y,14+aa*95,0,7);x.stroke();}}
  const D=S.demo;if(D){const e=Math.min(1,(now-D.t0)/D.dur),total=D.len.reduce((a,b)=>a+b,0);let target=e*total,head=null,ang=0;
   for(let k=0;k<D.subs.length;k++){const sp=D.subs[k],l=D.len[k],use=Math.max(0,Math.min(l,target));target-=l;if(use<=0)continue;let acc=0,part=[sp[0]];for(let i=1;i<sp.length;i++){const sl=Math.hypot(sp[i].x-sp[i-1].x,sp[i].y-sp[i-1].y);if(acc+sl>use){const f=(use-acc)/sl;part.push({x:sp[i-1].x+(sp[i].x-sp[i-1].x)*f,y:sp[i-1].y+(sp[i].y-sp[i-1].y)*f});break;}acc+=sl;part.push(sp[i]);}
    atNib(x,part.map(p=>({...p,v:.3})),'rgba(212,175,55,.6)');head=part[part.length-1];if(part.length>1){const a=part[part.length-2];ang=Math.atan2(head.y-a.y,head.x-a.x);}}
   if(head){x.save();x.translate(head.x,head.y);x.rotate(-AT_NIB);x.fillStyle=dk?'#f3dc8a':'#17231d';x.fillRect(-AT_NIBLEN/2,-3,AT_NIBLEN,6);x.restore();
    x.save();x.translate(head.x,head.y);x.setLineDash([3,4]);x.strokeStyle='#a8841f';x.lineWidth=1.6;x.beginPath();x.moveTo(-52*Math.cos(AT_NIB),52*Math.sin(AT_NIB));x.lineTo(52*Math.cos(AT_NIB),-52*Math.sin(AT_NIB));x.stroke();x.setLineDash([]);x.rotate(ang);x.fillStyle='#b3122b';x.beginPath();x.moveTo(26,0);x.lineTo(10,-9);x.lineTo(10,9);x.closePath();x.fill();x.restore();
    x.fillStyle=dk?'#f3dc8a':'#6b5a1e';x.font='600 22px system-ui';x.fillText('nib '+S.ang+'°',head.x+40,head.y-46);}
   if(e>=1&&now-D.t0>D.dur+1600)S.demo=null;}
  else if(S.step<S.L.steps.length&&!S.live&&!S.cur.length){const p=guideOf(S.L,S.step)[0][0],pu=1+.3*Math.sin(now/260);x.fillStyle='rgba(212,175,55,.3)';x.beginPath();x.arc(p.x,p.y,22*pu,0,7);x.fill();x.fillStyle='#D4AF37';x.beginPath();x.arc(p.x,p.y,8,0,7);x.fill();}}
 /* ---- composition (foil frames, themed paper, gradient / foil ink) ---- */
 function allStrokes(){return S.done.flat();}
 function bounds(strokes){let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const s of strokes)for(const p of s){a=Math.min(a,p.x);b=Math.min(b,p.y);c=Math.max(c,p.x);d=Math.max(d,p.y);}return{a:a-AT_NIBLEN,b:b-AT_NIBLEN,c:c+AT_NIBLEN,d:d+AT_NIBLEN};}
 function compose(W,H,poster){
  const T=theme(),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),u=W/1000;
  atPaper(x,W,H,T,u);
  const m=.04*W,rect=(i)=>()=>{x.beginPath();x.rect(m+i,m+i,W-2*m-2*i,H-2*m-2*i);};
  atFoilLine(x,rect(0),11*u,u,W,H);x.strokeStyle=T.txt;x.globalAlpha=.85;x.lineWidth=2*u;rect(17*u)();x.stroke();x.globalAlpha=1;
  atFoilLine(x,rect(26*u),3*u,u,W,H);
  for(const[cx,cy,sx,sy]of[[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]]){x.save();x.translate(cx,cy);x.scale(sx,sy);
   atFoilLine(x,()=>{x.beginPath();x.arc(0,0,46*u,0,Math.PI/2);},4*u,u,W,H);
   x.beginPath();x.moveTo(24*u,24*u);x.lineTo(44*u,24*u);x.lineTo(24*u,44*u);x.closePath();x.fillStyle=atFoil(x,0,0,60*u,60*u);x.fill();x.restore();}
  const st=allStrokes(),bb=bounds(st),aw=bb.c-bb.a,ah=bb.d-bb.b,areaTop=poster?H*.26:H*.17,areaH=poster?H*.5:H*.56,areaW=W*.72,k=Math.min(areaW/aw,areaH/ah);
  const art=document.createElement('canvas');art.width=W;art.height=H;const ax=art.getContext('2d');ax.translate((W-aw*k)/2-bb.a*k,areaTop+(areaH-ah*k)/2-bb.b*k);ax.scale(k,k);for(const s of st)atNib(ax,s,'#000',AT_NIBLEN,1);
  ax.setTransform(1,0,0,1,0,0);ax.globalCompositeOperation='source-in';
  if(T.grad){const ig=ax.createLinearGradient(0,areaTop,0,areaTop+areaH);ig.addColorStop(0,T.grad[0]);ig.addColorStop(.55,T.grad[1]);ig.addColorStop(1,T.grad[2]);ax.fillStyle=ig;}else ax.fillStyle=atFoil(ax,W*.15,areaTop,W*.85,areaTop+areaH);
  ax.fillRect(0,0,W,H);
  ax.globalCompositeOperation='source-atop';const hl=ax.createLinearGradient(W*.1,areaTop,W*.9,areaTop+areaH);hl.addColorStop(0,'rgba(255,255,255,0)');hl.addColorStop(.46,'rgba(255,255,255,0)');hl.addColorStop(.5,'rgba(255,255,255,'+(T.grad?.2:.5)+')');hl.addColorStop(.54,'rgba(255,255,255,0)');hl.addColorStop(1,'rgba(255,255,255,0)');ax.fillStyle=hl;ax.fillRect(0,0,W,H);
  x.save();x.shadowColor=T.grad?'rgba(40,25,5,.38)':'rgba(0,0,0,.65)';x.shadowBlur=14*u;x.shadowOffsetX=4*u;x.shadowOffsetY=7*u;x.drawImage(art,0,0);x.restore();
  /* foil-stamped captions */
  if(poster){x.direction='rtl';atFoilText(x,S.L.ar,W/2,H*.15,'700 '+Math.round(150*u)+'px HarfNaskh, serif',u,W*.5);x.direction='ltr';}
  atFoilText(x,S.L.cap||S.L.title,W/2,H*(poster?.82:.825),'italic 600 '+Math.round((poster?46:30)*u)+'px Georgia, serif',u,W*.6);
  x.fillStyle=T.sub;x.textAlign='center';x.textBaseline='middle';x.font='600 '+Math.round(20*u)+'px system-ui';x.fillText('LEVEL '+S.L.id+' · HAND-LETTERED IN KHATTI',W/2,H*(poster?.865:.865));
  if(poster){/* foil seal */const sx=W/2,sy=H*.93,r=62*u;x.save();x.translate(sx,sy);atFoilLine(x,()=>{x.beginPath();x.arc(0,0,r,0,7);},6*u,u,W,H);x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,rr=i%2?r*.38:r*.78;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}x.closePath();x.fillStyle=atFoil(x,-r,-r,r,r);x.fill();x.restore();}
  stampSignature(x,W*.9,H-W*.035,T.txt);return c;}
 function paintFinal(){const out=$('.at-out'),src=compose(1500,1000,false);out.width=1500;out.height=1000;out.getContext('2d').drawImage(src,0,0);}
 function showFinal(){S.result=true;$('.at-stage').hidden=true;$('.at-tools').hidden=true;$('.at-final').hidden=false;paintFinal();
  const v=atRead();v.levels[S.L.id]={count:Math.min(999,((v.levels[S.L.id]&&v.levels[S.L.id].count)|0)+1)};atWrite(v);ui();$('.at-msg').textContent='Masterpiece ready. Switch paper in Options above, or download.';atBuzz([10,30,10,30,18]);}
 function save(poster){const c=poster?compose(2400,3200,true):compose(3000,2000,false);c.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='khatti-level-'+S.L.id+(poster?'-poster':'')+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);},'image/png');}
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-atelier]');if(b&&!ov){e.preventDefault();open(b.dataset.atelier);}});
}
if(typeof document!=='undefined')installAtelier();
