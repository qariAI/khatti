import {atSmooth,atNib,atFoil} from './atelier.js';

/* Mandala Canvas · Tazhib Gallery · Masterclasses
   One full-screen overlay (#khatti-mandala) with four tabs. Everything is local: strokes, drafts and the gallery live in
   localStorage (khatti.mandala.v1 / khatti.mandala.draft.v1) and nothing is transmitted.
   Names are prefixed md / MD_ because every module shares one script scope in the single-file build. */
const MD_N=1000,MD_C=500,MD_KEY='khatti.mandala.v1',MD_DRAFT='khatti.mandala.draft.v1',MD_MAXW=18;
const MD_PIG=[{id:'blue',n:'Royal blue',c:'#1f3fa0'},{id:'gold',n:'Gold leaf',c:'#c9a227',foil:1},{id:'red',n:'Madder red',c:'#a8222f'},{id:'green',n:'Emerald',c:'#0f6b4a'},{id:'graphite',n:'Graphite',c:'#454545'},{id:'ink',n:'Ink',c:'#141414'}];
const MD_CLASSES=[
 {id:'rosette',n:'The 12-fold rosette',s:'Build a repeating flower from a single petal.',steps:[
  {t:'Draw one petal',d:'Royal blue, nib 8. Draw one teardrop petal outward from the centre. The canvas repeats it 12 times around.',cfg:{pig:'blue',w:8,mode:'mandala',petal:0}},
  {t:'Outline in gold',d:'Gold leaf, nib 4. Follow beside the edge of your petal, leaving a hair of blue showing.',cfg:{pig:'gold',w:4}},
  {t:'Finish with dots',d:'Madder red, nib 12. Tap five dots along the petal axis, getting smaller toward the centre.',cfg:{pig:'red',w:12}}]},
 {id:'vine',n:'The mirrored vine',s:'Let each petal mirror itself for a lacy border.',steps:[
  {t:'Switch on mirroring',d:'Mirror each petal is now on. Emerald, nib 6: draw one long S-curve between two circles.',cfg:{pig:'green',w:6,mode:'mandala',petal:1}},
  {t:'Add curling leaves',d:'Royal blue, nib 8. Add small comma-shaped leaves off the vine, always curling the same way.',cfg:{pig:'blue',w:8}},
  {t:'Gild the tips',d:'Gold leaf, nib 3. Touch a small gold dot at every leaf tip.',cfg:{pig:'gold',w:3}}]},
 {id:'cartouche',n:'The centre cartouche',s:'Frame the middle, then write your own word in it.',steps:[
  {t:'Ring the centre',d:'Gold leaf, nib 4. Draw one steady circle just inside the inner ring.',cfg:{pig:'gold',w:4,mode:'mandala',petal:0}},
  {t:'Write freehand',d:'Freehand mode, ink, nib 6. Write a word of your own in the middle from memory. No guide is shown.',cfg:{pig:'ink',w:6,mode:'free'}},
  {t:'Seal it',d:'Madder red, nib 10, mandala mode. Add a small seal dot beneath the word.',cfg:{pig:'red',w:10,mode:'mandala'}}]}];
const MD_GUIDES=[['circles','Concentric circles'],['star','Starburst outline'],['text','Inscription <bdi lang="ar" dir="rtl">ماشاءالله</bdi> (trace guide)'],['petal','Mirror each petal']];
let mdEl=null,mdS={view:'canvas',mode:'mandala',pig:'blue',w:8,guides:{circles:1,star:1,text:0,petal:0},strokes:[],redo:[],cleared:null,cur:null,coach:null,msg:''},mdBase=null,mdIl=null,mdIlS=0,mdRaf=0,mdSaveT=0,mdPrev=null;

const mdJ=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch{return d;}};
const mdW=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}};
const mdTrack=n=>{try{window.dispatchEvent(new CustomEvent('khatti:track',{detail:n}));}catch{}};
const mdPig=id=>MD_PIG.find(p=>p.id===id)||MD_PIG[0];
const mdFont=t=>{try{return document.fonts?document.fonts.load('64px HarfNaskh',t||'ا').catch(()=>0):Promise.resolve();}catch{return Promise.resolve();}};

/* ---- drawing ---- */
function mdPetalPath(x,r0,r1,w){const d=r1-r0;x.beginPath();x.moveTo(r0,0);x.bezierCurveTo(r0+d*.22,-w,r0+d*.68,-w*.95,r1,0);x.bezierCurveTo(r0+d*.68,w*.95,r0+d*.22,w,r0,0);x.closePath();}
function mdIllum(x,S){
 const u=S/MD_N;x.save();x.scale(u,u);x.translate(MD_C,MD_C);
 const gold=atFoil(x,-440,-440,440,440),ring=(r,lw,st=gold)=>{x.beginPath();x.arc(0,0,r,0,7);x.lineWidth=lw;x.strokeStyle=st;x.stroke();};
 /* outer cream starburst lobes */
 for(let k=0;k<24;k++){x.save();x.rotate(k*Math.PI/12);const big=k%2===0;mdPetalPath(x,380,big?462:424,big?36:20);x.fillStyle=big?'#f6ebcd':'#eddcb0';x.fill();x.lineWidth=2.2;x.strokeStyle=gold;x.stroke();
  if(big){x.beginPath();x.arc(440,0,5.5,0,7);x.fillStyle='#1f3fa0';x.fill();x.lineWidth=1.4;x.strokeStyle=gold;x.stroke();mdPetalPath(x,396,438,13);x.lineWidth=1.3;x.stroke();}
  x.restore();}
 /* royal blue annulus */
 const g=x.createRadialGradient(0,0,240,0,0,392);g.addColorStop(0,'#2c52c4');g.addColorStop(.55,'#1d3ca0');g.addColorStop(1,'#102670');
 x.beginPath();x.arc(0,0,392,0,7);x.moveTo(246,0);x.arc(0,0,246,0,7,true);x.fillStyle=g;x.fill('evenodd');
 /* twelve great petals: blue, with a red heart and gold edge */
 for(let k=0;k<12;k++){x.save();x.rotate(k*Math.PI/6);
  mdPetalPath(x,262,380,50);x.fillStyle='#3560d6';x.fill();x.lineWidth=2.6;x.strokeStyle=gold;x.stroke();
  mdPetalPath(x,282,358,30);x.fillStyle='#a8222f';x.fill();x.lineWidth=1.6;x.stroke();
  mdPetalPath(x,300,342,13);x.fillStyle='#f6ebcd';x.fill();x.lineWidth=1.1;x.stroke();
  x.beginPath();x.arc(352,0,4.2,0,7);x.fillStyle=gold;x.fill();
  /* curling vines either side */
  for(const m of[1,-1]){x.save();x.scale(1,m);x.beginPath();x.moveTo(266,16);x.bezierCurveTo(300,40,330,60,356,50);x.bezierCurveTo(372,44,372,28,360,26);x.lineWidth=1.9;x.strokeStyle=gold;x.stroke();x.restore();}
  x.restore();}
 /* twelve emerald half-petals between them */
 for(let k=0;k<12;k++){x.save();x.rotate(k*Math.PI/6+Math.PI/12);mdPetalPath(x,262,372,22);x.fillStyle='#0f6b4a';x.fill();x.lineWidth=1.8;x.strokeStyle=gold;x.stroke();mdPetalPath(x,284,346,8);x.fillStyle='#e6c75d';x.fill();x.restore();}
 /* beaded ring */
 for(let k=0;k<48;k++){const a=k*Math.PI/24;x.beginPath();x.arc(256*Math.cos(a),256*Math.sin(a),k%2?2.2:3.6,0,7);x.fillStyle=k%2?gold:'#f6ebcd';x.fill();}
 ring(392,4);ring(398,1.3);ring(246,4);ring(240,1.3);
 /* cream cartouche */
 const c=x.createRadialGradient(0,0,10,0,0,240);c.addColorStop(0,'#fcf5e0');c.addColorStop(1,'#f0e2bb');x.beginPath();x.arc(0,0,238,0,7);x.fillStyle=c;x.fill();
 ring(226,1.2);for(let k=0;k<24;k++){const a=k*Math.PI/12;x.beginPath();x.arc(233*Math.cos(a),233*Math.sin(a),2.6,0,7);x.fillStyle=k%2?'#1f3fa0':'#a8222f';x.fill();}
 x.restore();}
function mdPaper(x,S){const g=x.createRadialGradient(S/2,S/2,S*.1,S/2,S/2,S*.75);g.addColorStop(0,'#f8efd6');g.addColorStop(1,'#e7d6a9');x.fillStyle=g;x.fillRect(0,0,S,S);
 let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;x.fillStyle='rgba(120,86,24,.045)';for(let i=0;i<260;i++){x.beginPath();x.arc(r()*S,r()*S,r()*S*.004+.4,0,7);x.fill();}}
function mdGuides(x,S){const u=S/MD_N,G=mdS.guides;x.save();x.scale(u,u);x.translate(MD_C,MD_C);x.lineJoin='round';
 if(G.circles){x.strokeStyle='rgba(176,132,28,.62)';x.lineWidth=1.2;for(const r of[110,170,312,440]){x.beginPath();x.arc(0,0,r,0,7);x.stroke();}}
 if(G.star){x.strokeStyle='rgba(176,132,28,.78)';x.lineWidth=1.5;x.beginPath();for(let k=0;k<24;k++){const r=k%2?330:446,a=k*Math.PI/12;x.lineTo(r*Math.cos(a),r*Math.sin(a));}x.closePath();x.stroke();
  x.beginPath();for(let k=0;k<12;k++){const a=k*Math.PI/6;x.moveTo(0,0);x.lineTo(226*Math.cos(a),226*Math.sin(a));}x.strokeStyle='rgba(176,132,28,.28)';x.lineWidth=1;x.stroke();}
 if(G.text){x.font='96px HarfNaskh';x.textAlign='center';x.textBaseline='middle';x.direction='rtl';x.fillStyle='rgba(20,20,20,.22)';x.fillText('ماشاءالله',0,10);}
 x.restore();}
const mdSm=s=>{if(s._n!==s.p.length){s._sm=atSmooth(s.p.map(q=>({x:q[0],y:q[1],v:.4})));s._n=s.p.length;}return s._sm;};
function mdStroke(x,s,S){const u=S/MD_N,pg=mdPig(s.c),sm=mdSm(s),copies=s.m==='free'?[[0,0]]:[...Array(12).keys()].flatMap(k=>s.pt?[[k,0],[k,1]]:[[k,0]]);
 for(const[k,mir]of copies){x.save();x.scale(u,u);if(s.m!=='free'){x.translate(MD_C,MD_C);x.rotate(k*Math.PI/6);if(mir)x.scale(1,-1);x.translate(-MD_C,-MD_C);}
  atNib(x,sm,pg.foil?atFoil(x,100,100,900,900):pg.c,s.w*1.9);x.restore();}}
function mdCanvas(){return mdEl&&mdEl.querySelector('#md-canvas');}
function mdSize(c){return c.width;}
function mdEnsureIllum(S){if(mdIl&&mdIlS===S)return;mdIl=document.createElement('canvas');mdIl.width=mdIl.height=S;mdIlS=S;mdIllum(mdIl.getContext('2d'),S);}
function mdRebuild(c){const S=mdSize(c);mdEnsureIllum(S);if(!mdBase||mdBase.width!==S){mdBase=document.createElement('canvas');mdBase.width=mdBase.height=S;}
 const x=mdBase.getContext('2d');x.setTransform(1,0,0,1,0,0);mdPaper(x,S);x.drawImage(mdIl,0,0);mdGuides(x,S);for(const s of mdS.strokes)mdStroke(x,s,S);mdFlush(c);}
function mdFlush(c){const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.drawImage(mdBase,0,0);if(mdS.cur)mdStroke(x,mdS.cur,mdSize(c));}
function mdFrame(){cancelAnimationFrame(mdRaf);mdRaf=requestAnimationFrame(()=>{const c=mdCanvas();if(c&&mdBase)mdFlush(c);});}
function mdFit(){const c=mdCanvas();if(!c)return;const r=c.getBoundingClientRect(),S=Math.max(300,Math.min(1600,Math.round(r.width*Math.min(2,window.devicePixelRatio||1))));if(c.width!==S){c.width=c.height=S;}mdRebuild(c);}
/* strokes only on a transparent canvas, used by the test hook and the export */
function mdStrokesOnly(S){const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');for(const s of mdS.strokes)mdStroke(x,s,S);return c;}

/* ---- persistence ---- */
const mdPack=s=>({c:s.c,w:s.w,m:s.m,pt:s.pt?1:0,p:s.p.filter((q,i,a)=>!i||i===a.length-1||Math.hypot(q[0]-a[i-1][0],q[1]-a[i-1][1])>=3).map(q=>[Math.round(q[0]),Math.round(q[1])])});
const mdUnpack=s=>({c:s.c,w:s.w,m:s.m,pt:s.pt?1:0,p:s.p});
function mdDraftSave(){clearTimeout(mdSaveT);mdSaveT=setTimeout(()=>mdW(MD_DRAFT,{v:1,strokes:mdS.strokes.map(mdPack)}),400);}
function mdThumb(){const c=document.createElement('canvas');c.width=c.height=360;const x=c.getContext('2d');mdPaper(x,360);mdEnsureIllum(mdIlS||720);x.drawImage(mdIl,0,0,360,360);for(const s of mdS.strokes)mdStroke(x,s,360);return c.toDataURL('image/jpeg',.82);}
function mdGallery(){const v=mdJ(MD_KEY,null);return v&&v.v===1&&Array.isArray(v.works)?v.works:[];}
function mdGallerySave(){if(!mdS.strokes.length){mdS.msg='Draw something first.';return false;}
 let works=mdGallery();const w={id:'m'+Date.now().toString(36),t:new Date().toISOString().slice(0,10),thumb:mdThumb(),strokes:mdS.strokes.map(mdPack)};works.unshift(w);works=works.slice(0,MD_MAXW);
 while(works.length&&!mdW(MD_KEY,{v:1,works}))works.pop();const ok=works.some(x=>x.id===w.id);mdS.msg=ok?'Saved to your Tazhib Gallery.':'Not enough space on this device to save. Export a PNG instead.';if(ok)mdTrack('mandala_saved');return ok;}
function mdExport(name){const S=2000;mdEnsureIllum(Math.min(S,mdIlS||S));const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');mdPaper(x,S);const il=document.createElement('canvas');il.width=il.height=S;mdIllum(il.getContext('2d'),S);x.drawImage(il,0,0);for(const s of mdS.strokes)mdStroke(x,s,S);
 c.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name||'khatti-mandala-'+new Date().toISOString().slice(0,10)+'.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);},'image/png');mdTrack('mandala_export');}

/* ---- ui ---- */
const mdTabs=[['home','Studio Home'],['canvas','Mandala Canvas'],['gallery','Tazhib Gallery'],['classes','Masterclasses']];
function mdHead(){return '<header class="md-top"><div class="md-brand"><svg viewBox="-24 -24 48 48" aria-hidden="true"><g fill="none" stroke="#c9a227" stroke-width="1.2"><circle r="21"/><circle r="12" stroke="#1f3fa0" stroke-width="2.4"/>'+[...Array(12).keys()].map(k=>'<ellipse rx="3" ry="7" cy="-16" transform="rotate('+k*30+')" stroke="#1f3fa0"/>').join('')+'</g></svg><div><strong>Khatti</strong><small>Tazhib Studio</small></div></div><nav class="md-tabs" aria-label="Tazhib Studio">'+mdTabs.map(([k,n])=>'<button data-md-tab="'+k+'"'+(k===mdS.view?' aria-current="page"':'')+'><span class="l">'+n+'</span><span class="s">'+({home:'Home',canvas:'Canvas',gallery:'Gallery',classes:'Classes'}[k])+'</span></button>').join('')+'</nav><button class="md-x" data-md-tab="home" aria-label="Close Tazhib Studio">✕</button></header>';}
function mdPanel(){return '<aside class="md-panel"><section><h3>Pigments</h3><div class="md-pigs" role="group" aria-label="Pigments">'+MD_PIG.map(p=>'<button class="md-pig'+(p.foil?' foil':'')+'" data-md-pig="'+p.id+'" style="--c:'+p.c+'" aria-label="'+p.n+'" aria-pressed="'+(p.id===mdS.pig)+'"></button>').join('')+'</div></section><section><div class="md-row"><h3>Nib size</h3><output id="md-wv">'+mdS.w+'px</output></div><div class="md-nibrow"><input id="md-w" type="range" min="2" max="24" value="'+mdS.w+'" aria-label="Nib size"><svg viewBox="0 0 60 24" aria-hidden="true"><path d="M4 18C16 2 26 4 34 12S50 20 56 6" fill="none" stroke="#2a1f0e" stroke-width="'+(1+mdS.w/4)+'" stroke-linecap="round"/></svg></div></section><section><h3>Guides</h3>'+MD_GUIDES.map(([k,n])=>'<label class="md-chk"><input type="checkbox" data-md-guide="'+k+'"'+(mdS.guides[k]?' checked':'')+'> <span>'+n+'</span></label>').join('')+'</section><section class="md-acts"><button class="md-btn" data-md-do="save">Save to gallery</button><button class="md-btn ghost" data-md-do="export">Export PNG</button></section></aside>';}
function mdCoach(){const k=mdS.coach;if(!k)return '';const cl=MD_CLASSES.find(c=>c.id===k.id),st=cl.steps[k.i];return '<div class="md-coach" role="status"><div><small>'+cl.n+' · step '+(k.i+1)+' of '+cl.steps.length+'</small><strong>'+st.t+'</strong><p>'+st.d+'</p></div><div class="md-coach-b"><button class="md-btn ghost" data-md-do="cprev"'+(k.i?'':' disabled')+'>Back</button><button class="md-btn" data-md-do="cnext">'+(k.i<cl.steps.length-1?'Next step':'Finish')+'</button></div></div>';}
function mdCanvasView(){return mdCoach()+'<div class="md-stage"><section class="md-main"><div class="md-bar"><label>Drawing mode <select id="md-mode"><option value="mandala"'+(mdS.mode==='mandala'?' selected':'')+'>Mandala (12-fold)</option><option value="free"'+(mdS.mode==='free'?' selected':'')+'>Freehand</option></select></label><span class="md-sp"></span><button class="md-btn ghost sm" data-md-do="undo">Undo</button><button class="md-btn ghost sm" data-md-do="redo">Redo</button><button class="md-btn ghost sm" data-md-do="clear">Clear</button></div><div class="md-cwrap"><canvas id="md-canvas" aria-label="Mandala canvas. Draw with touch, mouse or pen; strokes repeat 12 times around the centre." role="img" tabindex="0"></canvas></div><p class="md-count" id="md-count" role="status" aria-live="polite"></p></section>'+mdPanel()+'</div>';}
function mdGalleryView(){const w=mdGallery();return '<div class="md-page"><h2>Tazhib Gallery</h2><p class="md-sub">Your saved illuminations. They stay on this device.</p>'+(w.length?'<div class="md-grid">'+w.map(k=>'<article class="md-card"><img src="'+k.thumb+'" alt="Mandala saved '+k.t+'" loading="lazy"><div><small>'+k.t+' · '+k.strokes.length+' strokes</small><div class="md-cbtn"><button class="md-btn sm" data-md-open="'+k.id+'">Open</button><button class="md-btn ghost sm" data-md-dl="'+k.id+'">PNG</button><button class="md-btn ghost sm" data-md-del="'+k.id+'" aria-label="Delete mandala from '+k.t+'">Delete</button></div></div></article>').join('')+'</div>':'<div class="md-empty"><p>Nothing here yet.</p><button class="md-btn" data-md-tab="canvas">Draw your first mandala</button></div>')+'</div>';}
function mdClassesView(){return '<div class="md-page"><h2>Masterclasses</h2><p class="md-sub">Short guided practices. Each step sets your pigment and nib, then you draw it yourself.</p><div class="md-classes">'+MD_CLASSES.map(c=>'<article class="md-class"><h3>'+c.n+'</h3><p>'+c.s+'</p><ol>'+c.steps.map(s=>'<li><strong>'+s.t+'</strong> <span>'+s.d+'</span></li>').join('')+'</ol><button class="md-btn" data-md-class="'+c.id+'">Start · '+c.steps.length+' steps</button></article>').join('')+'</div></div>';}
function mdRender(){if(!mdEl)return;mdEl.innerHTML=mdHead()+'<main class="md-body" data-view="'+mdS.view+'">'+(mdS.view==='canvas'?mdCanvasView():mdS.view==='gallery'?mdGalleryView():mdClassesView())+'</main><p class="md-toast" id="md-toast" role="status" aria-live="polite">'+mdS.msg+'</p>';
 if(mdS.view==='canvas'){mdFit();mdCount();}}
function mdCount(){const e=mdEl&&mdEl.querySelector('#md-count');if(e)e.textContent=mdS.strokes.length+' stroke'+(mdS.strokes.length===1?'':'s')+' · '+(mdS.mode==='free'?'freehand':(mdS.guides.petal?'24':'12')+'-fold symmetry');}
function mdToast(t){mdS.msg=t;const e=mdEl&&mdEl.querySelector('#md-toast');if(e)e.textContent=t;}
function mdOpen(view){if(!mdEl){mdEl=document.createElement('div');mdEl.id='khatti-mandala';mdEl.setAttribute('role','dialog');mdEl.setAttribute('aria-modal','true');mdEl.setAttribute('aria-label','Tazhib Studio');document.body.appendChild(mdEl);mdBind();}
 if(!mdS.strokes.length&&!mdS._loaded){mdS._loaded=1;const d=mdJ(MD_DRAFT,null);if(d&&d.v===1&&Array.isArray(d.strokes))mdS.strokes=d.strokes.map(mdUnpack);}
 mdS.view=view||'canvas';mdS.msg='';mdEl.hidden=false;document.body.classList.add('md-open');mdRender();mdFont('ماشاءالله').then(()=>{if(mdS.guides.text&&mdS.view==='canvas'){const c=mdCanvas();c&&mdRebuild(c);}});mdTrack('mandala_open');}
function mdClose(){if(!mdEl)return;mdEl.hidden=true;document.body.classList.remove('md-open');mdS.coach=null;mdDraftSave();}
function mdApply(cfg){if(!cfg)return;if(cfg.pig)mdS.pig=cfg.pig;if(cfg.w)mdS.w=cfg.w;if(cfg.mode)mdS.mode=cfg.mode;if('petal' in cfg)mdS.guides.petal=cfg.petal;}
function mdCommit(){const s=mdS.cur;mdS.cur=null;if(!s||s.p.length<2&&!s._dot)return;if(s.p.length<2)s.p.push([s.p[0][0]+.5,s.p[0][1]+.5]);mdS.strokes.push(s);mdS.redo=[];mdS.cleared=null;
 const x=mdBase.getContext('2d');mdStroke(x,s,mdSize(mdCanvas()));mdFrame();mdCount();mdDraftSave();if(mdS.strokes.length===1)mdTrack('mandala_first_stroke');}
function mdBind(){
 mdEl.addEventListener('click',e=>{const t=e.target.closest('button,[data-md-tab]');if(!t)return;const d=t.dataset;
  if(d.mdTab){if(d.mdTab==='home')mdClose();else{mdS.view=d.mdTab;mdS.msg='';mdRender();}return;}
  if(d.mdPig){mdS.pig=d.mdPig;mdEl.querySelectorAll('[data-md-pig]').forEach(b=>b.setAttribute('aria-pressed',String(b===t)));return;}
  if(d.mdClass){mdS.coach={id:d.mdClass,i:0};mdApply(MD_CLASSES.find(c=>c.id===d.mdClass).steps[0].cfg);mdS.view='canvas';mdRender();mdTrack('mandala_class');return;}
  if(d.mdOpen){const w=mdGallery().find(k=>k.id===d.mdOpen);if(w){mdS.strokes=w.strokes.map(mdUnpack);mdS.redo=[];mdS.cleared=null;mdDraftSave();mdS.view='canvas';mdS.msg='';mdRender();}return;}
  if(d.mdDel){const ws=mdGallery().filter(k=>k.id!==d.mdDel);mdW(MD_KEY,{v:1,works:ws});mdRender();return;}
  if(d.mdDl){const w=mdGallery().find(k=>k.id===d.mdDl);if(w){const a=document.createElement('a');a.href=w.thumb;a.download='khatti-mandala-'+w.t+'.jpg';document.body.appendChild(a);a.click();a.remove();}return;}
  const a=d.mdDo;if(!a)return;
  if(a==='undo'){if(mdS.strokes.length){mdS.redo.push(mdS.strokes.pop());}else if(mdS.cleared){mdS.strokes=mdS.cleared;mdS.cleared=null;}mdRebuild(mdCanvas());mdCount();mdDraftSave();}
  else if(a==='redo'){if(mdS.redo.length){mdS.strokes.push(mdS.redo.pop());mdRebuild(mdCanvas());mdCount();mdDraftSave();}}
  else if(a==='clear'){if(mdS.strokes.length){mdS.cleared=mdS.strokes;mdS.strokes=[];mdS.redo=[];mdRebuild(mdCanvas());mdCount();mdDraftSave();mdToast('Cleared. Undo brings it back.');}}
  else if(a==='save'){mdGallerySave();mdToast(mdS.msg);}
  else if(a==='export'){mdExport();}
  else if(a==='cnext'||a==='cprev'){const k=mdS.coach,cl=MD_CLASSES.find(c=>c.id===k.id);if(a==='cnext'){if(k.i>=cl.steps.length-1){mdS.coach=null;mdS.msg='Class complete. Save it to your gallery.';}else{k.i++;mdApply(cl.steps[k.i].cfg);}}else if(k.i){k.i--;mdApply(cl.steps[k.i].cfg);}mdRender();}});
 mdEl.addEventListener('change',e=>{const t=e.target;if(t.id==='md-mode'){mdS.mode=t.value;mdCount();}
  else if(t.dataset.mdGuide){mdS.guides[t.dataset.mdGuide]=t.checked?1:0;if(t.dataset.mdGuide==='text')mdFont('ماشاءالله').then(()=>mdRebuild(mdCanvas()));else mdRebuild(mdCanvas());mdCount();}});
 mdEl.addEventListener('input',e=>{if(e.target.id==='md-w'){mdS.w=+e.target.value;const o=mdEl.querySelector('#md-wv');if(o)o.textContent=mdS.w+'px';const p=mdEl.querySelector('.md-nibrow path');if(p)p.setAttribute('stroke-width',String(1+mdS.w/4));}});
 const pt=(e,c)=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)/r.width*MD_N,(e.clientY-r.top)/r.height*MD_N];};
 mdEl.addEventListener('pointerdown',e=>{const c=e.target.closest&&e.target.closest('#md-canvas');if(!c||e.button>0)return;e.preventDefault();try{c.setPointerCapture(e.pointerId);}catch{}
  mdS.cur={c:mdS.pig,w:mdS.w,m:mdS.mode,pt:mdS.guides.petal?1:0,p:[pt(e,c)],_dot:1};mdFrame();});
 mdEl.addEventListener('pointermove',e=>{const c=mdCanvas();if(!c||!mdS.cur||!c.hasPointerCapture||!c.hasPointerCapture(e.pointerId))return;const ev=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const q of(ev.length?ev:[e])){const p=pt(q,c),l=mdS.cur.p[mdS.cur.p.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>=1.5)mdS.cur.p.push(p);}mdFrame();});
 const up=e=>{if(mdS.cur&&mdCanvas())mdCommit();};mdEl.addEventListener('pointerup',up);mdEl.addEventListener('pointercancel',up);
 mdEl.addEventListener('keydown',e=>{if(e.key==='Escape')mdClose();});
 window.addEventListener('resize',()=>{if(mdEl&&!mdEl.hidden&&mdS.view==='canvas')mdFit();});}

if(typeof document!=='undefined'){
 window.addEventListener('khatti:open-mandala',()=>mdOpen('canvas'));
 document.addEventListener('click',e=>{const b=e.target.closest('[data-mandala]');if(b){e.preventDefault();document.getElementById('creative-sheet')?.close?.();mdOpen('canvas');}});
 window.__khattiMandala={open:v=>mdOpen(v||'canvas'),state:()=>mdS,strokesOnly:S=>mdStrokesOnly(S||600),gallery:mdGallery,reset:()=>{mdS.strokes=[];mdS.redo=[];mdS.cleared=null;mdS.coach=null;mdW(MD_DRAFT,{v:1,strokes:[]});mdW(MD_KEY,{v:1,works:[]});}};
}
