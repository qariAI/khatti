/* Notebook calligraphy hero for the Khatti studio home (vanilla port of the approved NotebookHero design). */
const NB={ink:'#b3122b',w:5,mode:'notebook',strokes:[],cur:null,raf:0,dpr:1};
const NB_FLOWER=(x,y,s,r)=>'<g transform="translate('+x+' '+y+') rotate('+r+') scale('+s+')" fill="none" stroke="#b3122b" stroke-width="2.2" stroke-linecap="round">'+[0,72,144,216,288].map(a=>'<ellipse cx="0" cy="-15" rx="7" ry="13" transform="rotate('+a+')" fill="rgba(179,18,43,.08)"/>').join('')+'<circle r="4" fill="#b3122b" stroke="none"/><path d="M0 22C-6 44-22 54-40 56M-14 44C-30 36-34 26-30 20"/></g>';
const NB_HEART=(x,y,s,r)=>'<path transform="translate('+x+' '+y+') rotate('+r+') scale('+s+')" d="M0-5C-8-15-22-3 0 14 22-3 8-15 0-5Z" fill="#b3122b" opacity=".9"/>';
export function nbHeroMarkup(){
 return '<div class="nb-stage"><div class="nb-sheet" data-nb-mode="'+NB.mode+'"><span class="nb-holes" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div class="nb-art" aria-hidden="true">'
 +'<div class="nb-word" dir="rtl" lang="ar"><span class="nb-red">الله</span><span class="nb-blk">الله</span></div>'
 +'<svg class="nb-flour" viewBox="0 0 600 280"><path class="nb-draw" d="M70 232C160 272 270 188 350 234S500 268 548 206C566 182 540 170 528 186" fill="none" stroke="#b3122b" stroke-width="4" stroke-linecap="round"/>'+NB_FLOWER(72,62,.95,-14)+NB_FLOWER(528,74,.62,18)+NB_HEART(300,34,.9,0)+NB_HEART(470,246,.55,14)+NB_HEART(128,222,.5,-12)+'</svg></div>'
 +'<canvas class="nb-canvas" aria-label="Practice surface. Draw with touch, mouse or pen."></canvas><span class="nb-cap">notebook · free draw</span></div>'
 +'<div class="nb-tools" role="toolbar" aria-label="Ink toolkit"><span class="nb-grp" aria-label="Nib size"><button data-nb="nib" data-v="2.5" aria-label="Fine nib" aria-pressed="false"><i style="width:5px;height:5px"></i></button><button data-nb="nib" data-v="5" aria-label="Medium nib" aria-pressed="true"><i style="width:8px;height:8px"></i></button><button data-nb="nib" data-v="9" aria-label="Broad nib" aria-pressed="false"><i style="width:12px;height:12px"></i></button></span>'
 +'<span class="nb-grp" aria-label="Ink"><button data-nb="ink" data-v="#1c1b1f" aria-label="Charcoal ink" aria-pressed="false"><i class="sw" style="background:#1c1b1f"></i></button><button data-nb="ink" data-v="#b3122b" aria-label="Ruby ink" aria-pressed="true"><i class="sw" style="background:#b3122b"></i></button></span>'
 +'<span class="nb-grp"><button data-nb="mode" data-v="notebook" aria-pressed="'+(NB.mode==='notebook')+'">Notebook</button><button data-nb="mode" data-v="studio" aria-pressed="'+(NB.mode==='studio')+'">Plain page</button></span>'
 +'<span class="nb-grp"><button data-nb="undo">Undo</button><button data-nb="clear">Clear</button></span></div>'
 +'<div class="nb-nudge" hidden role="status"><span>Nice line.</span><button type="button" data-path data-nb-nudge>Try it on the Path <b aria-hidden="true">→</b></button></div></div>';
}
function nbPaint(c){const x=c.getContext('2d'),now=performance.now(),d=NB.dpr;let live=false;x.clearRect(0,0,c.width,c.height);
 for(const s of NB.strokes){const g=Math.max(0,Math.min(1,(s.until-now)/1400));if(g>0)live=true;x.save();x.lineCap=x.lineJoin='round';x.strokeStyle=s.color;x.shadowColor=s.color;x.shadowBlur=g>0?(6+g*s.w*4)*d:0;
  if(s.pts.length===1){x.fillStyle=s.color;x.beginPath();x.arc(s.pts[0].x*d,s.pts[0].y*d,s.pts[0].w*d/2,0,7);x.fill();}
  {const P=s.pts;let from={x:P[0].x,y:P[0].y};for(let i=1;i<P.length;i++){const p=P[i],n=P[i+1],to=n?{x:(p.x+n.x)/2,y:(p.y+n.y)/2}:{x:p.x,y:p.y};x.lineWidth=p.w*d;x.beginPath();x.moveTo(from.x*d,from.y*d);x.quadraticCurveTo(p.x*d,p.y*d,to.x*d,to.y*d);x.stroke();from=to;}}
  x.restore();}
 NB.raf=live||NB.cur?requestAnimationFrame(()=>nbPaint(c)):0;}
export function nbHeroInit(root){
 const sheet=root.querySelector('.nb-sheet'),c=root.querySelector('.nb-canvas');if(!sheet||!c)return;cancelAnimationFrame(NB.raf);NB.raf=0;
 const kick=()=>{if(!NB.raf)NB.raf=requestAnimationFrame(()=>nbPaint(c));};
 const fit=()=>{NB.dpr=Math.min(2,window.devicePixelRatio||1);c.width=c.clientWidth*NB.dpr;c.height=c.clientHeight*NB.dpr;nbPaint(c);};
 if(window.ResizeObserver)new ResizeObserver(fit).observe(c);fit();
 const pt=(e,sp,prev)=>{const r=c.getBoundingClientRect();let k=1.3-Math.min(.65,sp*.22);if(e.pointerType==='pen'&&e.pressure>0)k=.55+e.pressure*.95;const w=NB.w*k;return{x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now(),w:prev?prev.w*.7+w*.3:w};};
 c.addEventListener('pointerdown',e=>{e.preventDefault();clearTimeout(NB.fadeT);sheet.classList.add('nb-drawing','nb-used');if(!NB.tracked){NB.tracked=1;window.dispatchEvent(new CustomEvent('khatti:track',{detail:'first_stroke'}));}c.setPointerCapture?.(e.pointerId);if(e.pointerType==='touch'&&navigator.vibrate&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))try{navigator.vibrate(6)}catch{}NB.cur={color:NB.ink,w:NB.w,pts:[pt(e,0)],until:Infinity};NB.strokes.push(NB.cur);kick();});
 c.addEventListener('pointermove',e=>{const s=NB.cur;if(!s)return;const r=c.getBoundingClientRect(),l=s.pts[s.pts.length-1],dist=Math.hypot(e.clientX-r.left-l.x,e.clientY-r.top-l.y);if(dist<2||s.pts.length>3000)return;s.pts.push(pt(e,dist/Math.max(1,performance.now()-l.t),l));});
 const nudge=root.querySelector('.nb-nudge');const showNudge=()=>{if(!nudge||NB.nudged&&nudge.dataset.shown)return;const n=window.khattiNext&&window.khattiNext();if(n&&n.started)return;nudge.hidden=false;nudge.dataset.shown='1';if(!NB.nudged){NB.nudged=1;window.dispatchEvent(new CustomEvent('khatti:track',{detail:'nudge_shown'}));}};if(NB.nudged&&NB.strokes.length)showNudge();
 const up=()=>{if(NB.cur){setTimeout(showNudge,500);clearTimeout(NB.fadeT);NB.fadeT=setTimeout(()=>sheet.classList.remove('nb-drawing'),1700);NB.cur.until=performance.now()+1400;NB.cur=null;kick();}};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
 root.querySelector('.nb-tools').addEventListener('click',e=>{const b=e.target.closest('[data-nb]');if(!b)return;e.stopPropagation();const k=b.dataset.nb,v=b.dataset.v;
  if(k==='nib')NB.w=+v;else if(k==='ink')NB.ink=v;else if(k==='mode'){NB.mode=v;sheet.dataset.nbMode=v;root.querySelector('.nb-cap').textContent=v==='studio'?'plain page':'notebook · free draw';}
  else if(k==='undo'){NB.strokes.pop();nbPaint(c);}else if(k==='clear'){NB.strokes=[];sheet.classList.remove('nb-used');if(nudge){nudge.hidden=true;delete nudge.dataset.shown;}nbPaint(c);}
  if(k!=='undo'&&k!=='clear')b.parentElement.querySelectorAll('[data-nb="'+k+'"]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));});
 nudge?.querySelector('button')?.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('khatti:track',{detail:'nudge_click'})));
 root.querySelectorAll('.nb-tools [data-nb="nib"]').forEach(o=>o.setAttribute('aria-pressed',String(+o.dataset.v===NB.w)));
 root.querySelectorAll('.nb-tools [data-nb="ink"]').forEach(o=>o.setAttribute('aria-pressed',String(o.dataset.v===NB.ink)));
}
