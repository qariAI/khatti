/* Khatti Masterclass Drills — three playable exercises in one full-screen overlay.
   Storage: khatti.drills.v1 {version:1, stars:{dbl:[],loop:[],sacred:[]}, xp, streak, lastDay, runs} */
const DR_KEY='khatti.drills.v1';
const DR_NAMES=[['بسم الله','Bismillah'],['الله','Allāh'],['الرحمن','Ar-Raḥmān'],['الرحيم','Ar-Raḥīm'],['النور','An-Nūr'],['السلام','As-Salām']];
const DR={
 dbl:{title:'Double-Pencil & Shading',sub:'Two pens, one steady hand. Keep the leading pen on the gold guide; the second pen follows at a fixed offset.',guides:['Upright stem','Gentle arc','Rolling wave'],thr:[.5,.7,.85]},
 loop:{title:'Continuous Loop Masterclass',sub:'Press the glowing start, then keep your pen on the travelling dot. Smooth, unbroken, steady.',guides:['Figure eight','Spiral bloom','Rolling loops'],thr:[.45,.65,.82]},
 sacred:{title:'Sacred Names & Compositions',sub:'Trace the name inside the frame, then check how well it sits on the centre lines.',guides:DR_NAMES.map(n=>n[1]),thr:[.6,.75,.88]}
};
const DR_FONT="'HarfNaskh','Amiri','Noto Naskh Arabic','Scheherazade New',serif";
function drFresh(){return {version:1,stars:{dbl:[0,0,0],loop:[0,0,0],sacred:[0,0,0,0,0,0]},xp:0,streak:0,lastDay:'',runs:0};}
function drRead(){try{const v=JSON.parse(localStorage.getItem(DR_KEY));if(v&&v.version===1&&v.stars&&Array.isArray(v.stars.dbl)&&Array.isArray(v.stars.loop)&&Array.isArray(v.stars.sacred)&&Number.isFinite(v.xp)){const f=drFresh();for(const k of['dbl','loop','sacred'])f.stars[k]=f.stars[k].map((_,i)=>Math.max(0,Math.min(3,v.stars[k][i]|0)));f.xp=Math.max(0,v.xp|0);f.streak=Math.max(0,v.streak|0);f.lastDay=typeof v.lastDay==='string'?v.lastDay.slice(0,10):'';f.runs=Math.max(0,v.runs|0);return f;}}catch{}return drFresh();}
function drWrite(v){try{localStorage.setItem(DR_KEY,JSON.stringify(v));}catch{}}
function drDay(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
export function drillsSummary(){const v=drRead(),o={xp:v.xp,streak:v.lastDay===drDay()||v.lastDay===drDay(-1)?v.streak:0};for(const k of['dbl','loop','sacred']){const s=v.stars[k].reduce((a,b)=>a+b,0);o[k]=s?'★ '+s+'/'+v.stars[k].length*3:'New';}return o;}

function drGuide(mode,gi,w,h){
 const N=90,s=Math.min(w,h),ox=(w-s)/2,oy=(h-s)/2,P=[];let f;
 if(mode==='dbl')f=[u=>[.62-.24*u,.18+.62*u],u=>{const a=(.1+.8*u)*Math.PI;return[.5+.34*Math.cos(a),.3+.34*Math.sin(a)];},u=>[.88-.76*u,.5+.17*Math.sin(u*Math.PI*4)]][gi];
 else f=[u=>{const t=u*2*Math.PI,d=1+Math.sin(t)**2;return[.5+.38*Math.cos(t)/d,.5+.42*Math.sin(t)*Math.cos(t)/d];},u=>{const a=u*4*Math.PI,r=.05+.31*u;return[.5+r*Math.cos(a),.5+r*Math.sin(a)];},u=>[.9-.8*u+.1*Math.sin(u*Math.PI*6),.5-.13*Math.cos(u*Math.PI*6)+.13]][gi];
 for(let i=0;i<N;i++){const[x,y]=f(i/(N-1));P.push({x:ox+x*s,y:oy+y*s});}
 return P;
}
const drDist=(p,a)=>Math.hypot(p.x-a.x,p.y-a.y);
const drNear=(p,G)=>{let m=1e9;for(const g of G){const d=drDist(p,g);if(d<m)m=d;}return m;};

export function installDrills(){
 if(typeof document==='undefined'||window.__khattiDrills)return;window.__khattiDrills=true;
 let ov=null,S=null,raf=0,prevFocus=null,ro=null;
 const OFF={x:16,y:11};
 const $=(s)=>ov.querySelector(s);
 function open(mode){
  if(ov||!DR[mode])return;prevFocus=document.activeElement;
  S={mode,gi:0,strokes:[],cur:null,shade:true,frame:false,result:null,run:null,ptr:null,down:false,w:0,h:0,G:[]};
  ov=document.createElement('div');ov.id='drill-overlay';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-labelledby','drill-title');
  ov.innerHTML='<header class="dr-head"><button class="dr-x" data-dr="close" aria-label="Close drill">×</button><div class="dr-ttl"><small>MASTERCLASS DRILL</small><h2 id="drill-title"></h2></div><div class="dr-chips" aria-label="Your progress"></div></header><p class="dr-sub"></p><div class="dr-guides" role="group" aria-label="Choose a guide"></div><div class="dr-stage"><canvas aria-label="Drawing canvas. Needs touch, mouse or pen."></canvas></div><div class="dr-tools"></div><div class="dr-result" role="status" aria-live="polite" hidden></div>';
  document.body.append(ov);document.body.classList.add('dr-lock');
  $('#drill-title').textContent=DR[mode].title;$('.dr-sub').textContent=DR[mode].sub;
  ov.addEventListener('click',onClick);ov.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
  const c=$('canvas');c.addEventListener('pointerdown',pDown);c.addEventListener('pointermove',pMove);c.addEventListener('pointerup',pUp);c.addEventListener('pointercancel',pUp);
  ro=new ResizeObserver(size);ro.observe($('.dr-stage'));
  chips();tabs();tools();size();$('.dr-x').focus();
  (document.fonts?.load?document.fonts.load('80px HarfNaskh','بسم الله').catch(()=>{}):Promise.resolve());
  const tick=()=>{raf=requestAnimationFrame(tick);frame();draw();};tick();
 }
 function close(){if(!ov)return;cancelAnimationFrame(raf);ro?.disconnect();ov.remove();ov=null;S=null;document.body.classList.remove('dr-lock');const sm=drillsSummary();document.querySelectorAll('[data-drill-badge]').forEach(b=>{b.textContent=sm[b.dataset.drillBadge]||'New';});const hs=document.querySelector('[data-drill-stats]');if(hs)hs.textContent=sm.xp?sm.streak+'-day streak · '+sm.xp+' XP':'Play · earn stars';prevFocus?.focus?.();}
 function chips(){const v=drRead(),sm=drillsSummary();$('.dr-chips').innerHTML='<span>★ '+['dbl','loop','sacred'].reduce((a,k)=>a+v.stars[k].reduce((x,y)=>x+y,0),0)+'</span><span>'+sm.streak+'-day streak</span><span>'+v.xp+' XP</span>';}
 function tabs(){const v=drRead();$('.dr-guides').innerHTML=DR[S.mode].guides.map((g,i)=>'<button data-dr="guide" data-i="'+i+'" aria-pressed="'+(i===S.gi)+'">'+g+'<small>'+'★'.repeat(v.stars[S.mode][i])+'☆'.repeat(3-v.stars[S.mode][i])+'</small></button>').join('');}
 function tools(){const m=S.mode;$('.dr-tools').innerHTML=(m==='dbl'?'<button data-dr="shade" aria-pressed="'+S.shade+'">Depth shading</button>':'')+(m==='sacred'?'<button data-dr="frame" aria-pressed="'+S.frame+'">Frame</button>':'')+'<button data-dr="clear">Clear</button>'+(m!=='loop'?'<button class="dr-go" data-dr="finish">'+(m==='sacred'?'Check my trace':'Finish drill')+'</button>':'');}
 function onClick(e){const b=e.target.closest('[data-dr]');if(!b)return;const a=b.dataset.dr;
  if(a==='close')close();
  else if(a==='guide'){S.gi=+b.dataset.i;reset();tabs();}
  else if(a==='shade'){S.shade=!S.shade;tools();}
  else if(a==='frame'){S.frame=!S.frame;tools();}
  else if(a==='clear'){reset();}
  else if(a==='finish')finishManual();
  else if(a==='again')reset();
  else if(a==='next'){S.gi=(S.gi+1)%DR[S.mode].guides.length;reset();tabs();}
 }
 function reset(){S.strokes=[];S.cur=null;S.run=null;S.result=null;S.down=false;$('.dr-result').hidden=true;layout();}
 function size(){if(!ov)return;const st=$('.dr-stage'),c=$('canvas'),r=st.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);S.w=Math.max(200,Math.floor(r.width));S.h=Math.max(200,Math.floor(r.height));c.style.width=S.w+'px';c.style.height=S.h+'px';c.width=S.w*dpr;c.height=S.h*dpr;c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);layout();}
 function layout(){if(S.mode!=='sacred')S.G=drGuide(S.mode,S.gi,S.w,S.h);}
 const pos=e=>{const r=e.currentTarget.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()};};
 function pDown(e){if(S.result)return;e.preventDefault();const p=pos(e);e.currentTarget.setPointerCapture?.(e.pointerId);
  if(S.mode==='loop'&&!S.run){if(drDist(p,S.G[0])>56)return;S.strokes=[];S.run={t0:performance.now(),dur:9000,hits:0,frames:0};}
  S.down=true;S.ptr=p;S.cur=[p];S.strokes.push(S.cur);}
 function pMove(e){if(!S.down)return;const p=pos(e);S.ptr=p;const l=S.cur[S.cur.length-1];if(Math.hypot(p.x-l.x,p.y-l.y)>2&&S.cur.length<4000)S.cur.push(p);}
 function pUp(){S.down=false;S.cur=null;}
 function frame(){const r=S.run;if(!r||S.result)return;const u=(performance.now()-r.t0)/r.dur;r.frames++;if(S.down&&S.ptr){const g=S.G[Math.min(S.G.length-1,Math.floor(Math.max(0,Math.min(1,u))*(S.G.length-1)))];if(drDist(S.ptr,g)<36)r.hits++;}if(u>=1){S.run=null;S.down=false;award(r.frames?r.hits/r.frames:0,'Rhythm held: '+Math.round(100*(r.frames?r.hits/r.frames:0))+'% of the beat.');}}
 function finishManual(){
  if(S.mode==='dbl'){const U=S.strokes.flat();if(U.length<12){note('Draw along the guide first, then finish.');return;}const G=S.G;const prec=U.filter(p=>drNear(p,G)<26).length/U.length,cov=G.filter(g=>drNear(g,U)<30).length/G.length;award((prec+cov)/2,'On the line '+Math.round(prec*100)+'% · guide covered '+Math.round(cov*100)+'%.');}
  else{const U=S.strokes.flat();if(U.length<12){note('Trace the name first, then check.');return;}const r=sacredScore();award((r.prec+r.cov)/2,'Precision '+Math.round(r.prec*100)+'% · coverage '+Math.round(r.cov*100)+'%.');}
 }
 function note(t){const r=$('.dr-result');r.hidden=false;r.className='dr-result';r.innerHTML='<p>'+t+'</p>';}
 function award(score,detail){
  const thr=DR[S.mode].thr,stars=thr.filter(t=>score>=t).length,v=drRead(),prev=v.stars[S.mode][S.gi]||0,isBest=stars>prev;
  let gain=stars*10+(isBest&&stars>0?5:0);
  if(isBest)v.stars[S.mode][S.gi]=stars;v.xp+=gain;v.runs++;
  if(stars>0&&v.lastDay!==drDay()){v.streak=v.lastDay===drDay(-1)?v.streak+1:1;v.lastDay=drDay();}
  drWrite(v);S.result={score,stars,gain};chips();tabs();
  const r=$('.dr-result');r.hidden=false;r.className='dr-result show';
  const msg=stars===3?'Masterful.':stars===2?'Beautiful control.':stars===1?'Good start. Slow down and repeat.':'Keep the pen steadier next time.';
  r.innerHTML='<div class="dr-stars" aria-label="'+stars+' of 3 stars">'+[0,1,2].map(i=>'<span class="'+(i<stars?'on':'')+'">★</span>').join('')+'</div><strong>'+Math.round(score*100)+'% · '+msg+'</strong><small>'+detail+(gain?' +'+gain+' XP.':'')+(S.mode==='sacred'?' '+DR_NAMES[S.gi][1]+' is one of the 99 Names.':'')+'</small><div class="dr-ractions"><button data-dr="again">Try again</button><button class="dr-go" data-dr="next">Next guide →</button></div>';
 }
 function sacredLayout(){const w=S.w,h=S.h,t=DR_NAMES[S.gi][0];const tmp=document.createElement('canvas').getContext('2d');let size=Math.min(h*.5,200);tmp.font=size+'px '+DR_FONT;const mw=tmp.measureText(t).width;if(mw>w*.78)size*=w*.78/mw;return{t,size:Math.max(40,size),cx:w/2,cy:h/2+size*.06};}
 function sacredScore(){
  const w=S.w,h=S.h,L=sacredLayout(),mk=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;},put=(c,wd,strokes)=>{const x=c.getContext('2d');x.lineCap=x.lineJoin='round';x.lineWidth=wd;x.strokeStyle='#000';for(const s of strokes){x.beginPath();s.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));if(s.length===1)x.lineTo(s[0].x+.1,s[0].y);x.stroke();}};
  const txt=(c,tol)=>{const x=c.getContext('2d');x.textAlign='center';x.textBaseline='middle';x.direction='rtl';x.font=L.size+'px '+DR_FONT;x.fillStyle='#000';x.fillText(L.t,L.cx,L.cy);if(tol){x.lineWidth=tol;x.lineJoin='round';x.strokeStyle='#000';x.strokeText(L.t,L.cx,L.cy);}};
  const core=mk(),tol=mk(),u=mk(),ud=mk();txt(core,0);txt(tol,22);put(u,9,S.strokes);put(ud,22,S.strokes);
  const a=c=>c.getContext('2d').getImageData(0,0,w,h).data,C=a(core),T=a(tol),U=a(u),D=a(ud);let uc=0,ut=0,cc=0,cd=0;
  for(let i=3;i<C.length;i+=4){if(U[i]>40){uc++;if(T[i]>40)ut++;}if(C[i]>40){cc++;if(D[i]>40)cd++;}}
  return{prec:uc?ut/uc:0,cov:cc?cd/cc:0};
 }
 function paper(x){const w=S.w,h=S.h,g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#fbf5e4');g.addColorStop(1,'#f2e8cc');x.fillStyle=g;x.fillRect(0,0,w,h);x.strokeStyle='rgba(18,53,36,.06)';x.lineWidth=1;const st=36;x.beginPath();for(let i=st;i<w;i+=st){x.moveTo(i,0);x.lineTo(i,h);}for(let j=st;j<h;j+=st){x.moveTo(0,j);x.lineTo(w,j);}x.stroke();}
 function path(x,pts,dx=0,dy=0){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p.x+dx,p.y+dy):x.moveTo(p.x+dx,p.y+dy));}
 function draw(){
  if(!ov)return;const x=$('canvas').getContext('2d'),w=S.w,h=S.h,now=performance.now();x.clearRect(0,0,w,h);paper(x);x.lineCap=x.lineJoin='round';
  if(S.mode==='sacred'){
   x.strokeStyle='rgba(212,175,55,.55)';x.setLineDash([6,6]);x.lineWidth=1;x.beginPath();x.moveTo(w/2,12);x.lineTo(w/2,h-12);x.moveTo(12,h/2);x.lineTo(w-12,h/2);x.stroke();x.setLineDash([]);
   if(S.frame){x.strokeStyle='#D4AF37';x.lineWidth=3;x.strokeRect(14,14,w-28,h-28);x.strokeStyle='rgba(18,53,36,.55)';x.lineWidth=1;x.strokeRect(22,22,w-44,h-44);}
   const L=sacredLayout();x.textAlign='center';x.textBaseline='middle';x.direction='rtl';x.font=L.size+'px '+DR_FONT;x.fillStyle='rgba(18,53,36,.16)';x.fillText(L.t,L.cx,L.cy);
  }else{
   const G=S.G;x.lineWidth=S.mode==='dbl'?22:16;x.strokeStyle='rgba(212,175,55,.14)';path(x,G);x.stroke();
   x.lineWidth=2;x.setLineDash([2,9]);x.strokeStyle='rgba(168,132,31,.9)';x.lineDashOffset=-now/60;path(x,G);x.stroke();x.setLineDash([]);
   if(S.mode==='dbl'){const u=(now/2200)%1,i=Math.min(G.length-2,Math.floor(u*(G.length-1))),a=G[i],b=G[i+1],ang=Math.atan2(b.y-a.y,b.x-a.x);x.save();x.translate(a.x,a.y);x.rotate(ang);x.fillStyle='#123524';x.beginPath();x.moveTo(11,0);x.lineTo(-7,-8);x.lineTo(-7,8);x.closePath();x.fill();x.restore();x.fillStyle='#123524';x.beginPath();x.arc(G[0].x,G[0].y,11,0,7);x.fill();x.fillStyle='#D4AF37';x.font='700 12px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText('1',G[0].x,G[0].y+1);}
   else{const p0=G[0],pulse=1+.25*Math.sin(now/260);x.fillStyle='rgba(212,175,55,.28)';x.beginPath();x.arc(p0.x,p0.y,22*pulse,0,7);x.fill();x.fillStyle='#D4AF37';x.beginPath();x.arc(p0.x,p0.y,9,0,7);x.fill();
    if(!S.run&&!S.result){x.fillStyle='#123524';x.font='600 13px system-ui';x.textAlign='center';x.fillText('Press here to begin',p0.x,p0.y-30);}
    if(S.run){const u=Math.min(1,(now-S.run.t0)/S.run.dur),g=G[Math.floor(u*(G.length-1))];const grd=x.createRadialGradient(g.x,g.y,2,g.x,g.y,26);grd.addColorStop(0,'rgba(255,230,140,1)');grd.addColorStop(1,'rgba(212,175,55,0)');x.fillStyle=grd;x.beginPath();x.arc(g.x,g.y,26,0,7);x.fill();x.fillStyle='#fff6cf';x.beginPath();x.arc(g.x,g.y,7,0,7);x.fill();x.fillStyle='rgba(18,53,36,.12)';x.fillRect(0,h-5,w,5);x.fillStyle='#D4AF37';x.fillRect(0,h-5,w*u,5);}}
  }
  for(const s of S.strokes){if(!s.length)continue;
   if(S.mode==='dbl'){
    if(S.shade&&s.length>1){x.fillStyle='rgba(212,175,55,.3)';for(let i=1;i<s.length;i++){const a=s[i-1],b=s[i];x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.lineTo(b.x+OFF.x,b.y+OFF.y);x.lineTo(a.x+OFF.x,a.y+OFF.y);x.closePath();x.fill();}}
    x.lineWidth=5;x.strokeStyle='#b8962e';path(x,s,OFF.x,OFF.y);if(s.length===1)x.lineTo(s[0].x+OFF.x+.1,s[0].y+OFF.y);x.stroke();
    x.strokeStyle='#123524';path(x,s);if(s.length===1)x.lineTo(s[0].x+.1,s[0].y);x.stroke();
   }else{
    if(S.mode==='loop'){x.lineWidth=14;x.strokeStyle='rgba(212,175,55,.25)';path(x,s);x.stroke();}
    x.lineWidth=S.mode==='loop'?6:9;x.strokeStyle='#123524';path(x,s);if(s.length===1)x.lineTo(s[0].x+.1,s[0].y);x.stroke();
   }}
 }
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-drill]');if(b&&!ov){e.preventDefault();open(b.dataset.drill);}});
 window.addEventListener('khatti:open-drill',e=>open(e.detail));
}
if(typeof document!=='undefined')installDrills();
