import {atSmoothXY} from './atelier.js';
import {guardCanvasPointer,announce} from './canvas-viewport.js';
import {CHAPTER3_KEY,CHAPTER3_EXERCISES,CHAPTER3_STORY,CHAPTER3_PAPERS,CHAPTER3_COLORS,CHAPTER3_MAX_PIECES,fresh,validChapter3,exerciseStates,rewards,chapterLabel,makePiece,addPiece,removePiece} from './chapter3-model.js';
/** Chapter 3 pilot screen: watch, try, create, exhibit. Local only, unscored, participation labels only. */
export function installChapter3({rerender,openLesson,attempts,download,toast,icon,esc,uuid}){
 let state=fresh(),readable=true,notice='',view='hub',storyIndex=0,replayKey=0,confirming=null;
 let draft={strokes:[],redo:[]},color=CHAPTER3_COLORS.base[0],width=14,paper='cream',borderOn=false,grid=false;
 let canvas=null,observer=null,frame=0,active=null,pointer=null,guard=null;
 try{const raw=localStorage.getItem(CHAPTER3_KEY);if(raw){if(raw.length*2>1024*1024)throw Error();const v=JSON.parse(raw);if(!validChapter3(v))throw Error();state=v;}}catch{readable=false;notice='Saved chapter data could not be read and was left untouched. This session will not overwrite it.';}
 const save=()=>{if(window.HarfProgressRestoring)return true;try{if(!readable)throw Error();localStorage.setItem(CHAPTER3_KEY,JSON.stringify(state));return true;}catch{notice='Not saved: storage is full or unavailable. Download your piece before closing.';return false;}};
 const A=()=>attempts(),R=()=>rewards(state,A()),unlocked=id=>R().find(r=>r.id===id)?.unlocked;
 const fmt=d=>{try{return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}catch{return '';}};
 const chip=(text,kind='')=>'<span class="ch3-chip '+kind+'">'+text+'</span>';

 /* ---------- markup ---------- */
 function animation(){
  const dots=[0,1,2,3,4].map(i=>'<polygon class="ch3-dot" style="animation-delay:'+(.4+i*.45)+'s" points="160,'+(34+i*30)+' 170,'+(42+i*30)+' 160,'+(50+i*30)+' 150,'+(42+i*30)+'"/>').join('');
  return '<svg class="ch3-anim" data-replay="'+replayKey+'" viewBox="0 0 320 200" role="img" aria-label="Animation: a pen makes one dot, then a row of dots, which join into a straight stem."><rect width="320" height="200" rx="18" fill="#faf7ef"/><line class="ch3-guide" x1="40" y1="176" x2="280" y2="176"/>'+dots+'<path class="ch3-stem" d="M160 36 L160 164" /><g class="ch3-nib" transform="translate(160 30)"><rect x="-5" y="-14" width="10" height="22" rx="2" transform="rotate(35)"/></g></svg>';
 }
 function motif(){return '<svg class="ch3-motif" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><line x1="14" y1="106" x2="106" y2="106" stroke="#c9a24a" stroke-opacity=".5" stroke-dasharray="3 4"/><path d="M60 14 L60 92" stroke="#c9a24a" stroke-width="7" stroke-linecap="round"/>'+[18,38,58,78,98].map(y=>'<polygon points="60,'+(y-9)+' 69,'+y+' 60,'+(y+9)+' 51,'+y+'" fill="#faf7ef"/>').join('')+'</svg>';}
 function hero(){const l=chapterLabel(state,A());return '<button class="ch3-hero" data-action="chapter3">'+motif()+'<div><span class="ch3-kicker">Chapter 3 · Pilot</span><h2>The proportioned pen</h2><p>Make a dot. Build a stem. Compose a piece of your own.</p><span class="ch3-cta">'+(l==='Not started'?'Begin the chapter':'Continue · '+l)+' →</span></div></button>';}
 function hub(){
  const ex=exerciseStates(A()),label=chapterLabel(state,A()),rw=R();
  return '<div class="chapter3" data-ch3-view="hub"><button class="textbtn" data-action="nav" data-id="home">'+icon('back')+'Learn</button>'
  +'<header class="ch3-head ch3-banner">'+motif()+'<span class="eyebrow">Chapter 3 · Pilot</span><h1 id="ch3-title" tabindex="-1">The proportioned pen</h1>'
  +'<p>Make a dot, build a stem, then compose a piece of your own.</p>'
  +'<p class="ch3-scope">Historical inspiration, not a course in an authentic script. These exercises practise the pen, the dot and measured forms.</p>'
  +'<p class="ch3-draft" role="note">Draft chapter: story sources and lesson models are awaiting review. Nothing here is teacher-approved.</p>'
  +'<p class="ch3-label">Your chapter: '+chip(label,label==='Not started'?'':'on')+'</p></header>'
  +'<ol class="ch3-steps">'
  +'<li class="ch3-step"><div><h2>1 · Watch</h2><p>A short animated introduction and three story cards.</p></div>'+(state.explored?chip('Explored','on'):'')+'<button class="btn" data-ch="story">'+(state.explored?'Watch again':'Watch the introduction')+'</button></li>'
  +'<li class="ch3-step"><div><h2>2 · Try</h2><p>Three short exercises from the existing lessons.</p><ul class="ch3-ex">'+ex.map(e=>'<li><div><strong>'+esc(e.title)+'</strong><span>'+esc(e.doing)+'</span><span class="ch3-tags">'+chip(e.label,e.attempted?'on':'')+chip('Draft model')+'</span></div><button class="btn secondary" data-ch="lesson" data-id="'+e.lessonId+'" aria-label="Start exercise: '+esc(e.title)+'">'+(e.attempted?'Again':'Start')+'</button></li>').join('')+'</ul></div></li>'
  +'<li class="ch3-step"><div><h2>3 · Create</h2><p>One composition in your own ink. Not scored, saved on this device.</p></div><button class="btn" data-ch="compose">'+(draft.strokes.length?'Continue composition':'Start composition')+'</button></li>'
  +'<li class="ch3-step"><div><h2>4 · Exhibition</h2><p>Your pieces, newest first. Up to '+CHAPTER3_MAX_PIECES+'.</p></div>'+(state.pieces.length?chip('Piece completed','on'):'')+'<button class="btn secondary" data-ch="exhibition">My exhibition ('+state.pieces.length+')</button></li>'
  +'</ol><section class="ch3-rewards" aria-label="Rewards"><h2>Rewards</h2><ul>'+rw.map(r=>'<li><strong>'+esc(r.title)+'</strong> '+chip(r.unlocked?'Unlocked':'Locked',r.unlocked?'on':'')+'<span>'+(r.unlocked?'Available in your composition.':esc(r.rule))+'</span></li>').join('')+'</ul><p class="small muted">Rewards are cosmetic, stay on this device and never affect scores, XP or leaderboards.</p></section>'
  +(notice?'<p class="ch3-notice" role="status">'+esc(notice)+'</p>':'')+'</div>';
 }
 function story(){
  const c=CHAPTER3_STORY[storyIndex],last=storyIndex===CHAPTER3_STORY.length-1;
  return '<div class="chapter3" data-ch3-view="story"><button class="textbtn" data-ch="hub">'+icon('back')+'Chapter 3</button>'
  +'<header class="ch3-head"><span class="eyebrow">Watch · '+(storyIndex+1)+' of '+CHAPTER3_STORY.length+'</span><h1 id="ch3-title" tabindex="-1">'+esc(c.title)+'</h1></header>'
  +(storyIndex===0?animation()+'<button class="textbtn" data-ch="story-replay">'+icon('replay')+'Replay animation</button>':'')
  +'<p class="ch3-story">'+esc(c.text)+'</p><p class="ch3-draft" role="note">Draft text · '+esc(c.source)+'. Attributions are traditional and debated by scholars.</p>'
  +'<div class="ch3-nav">'+(storyIndex>0?'<button class="btn secondary" data-ch="story-prev">Back</button>':'<button class="btn secondary" data-ch="hub">Skip</button>')+'<button class="btn" data-ch="'+(last?'story-finish':'story-next')+'">'+(last?'Finish':'Next')+'</button></div></div>';
 }
 function swatches(){
  const pal=unlocked('palette');
  return [...CHAPTER3_COLORS.base,...CHAPTER3_COLORS.palette].map((c,i)=>{const locked=i>=3&&!pal;return '<button class="ch3-swatch" style="--swatch:'+c+'" data-ch="color" data-value="'+c+'" aria-pressed="'+(c===color)+'" aria-label="Ink '+(i+1)+(locked?' (locked)':'')+'"'+(locked?' disabled':'')+'></button>';}).join('');
 }
 function compose(){
  const warm=unlocked('paper'),border=unlocked('border');
  return '<div class="chapter3 ch3-compose" data-ch3-view="compose"><button class="textbtn" data-ch="hub">'+icon('back')+'Chapter 3</button>'
  +'<header class="ch3-head"><span class="eyebrow">Create</span><h1 id="ch3-title" tabindex="-1">Your composition</h1><p>Use dots and stems. Nothing here is scored.</p></header>'
  +'<canvas id="ch3-canvas" class="ch3-canvas" role="img" aria-label="Drawing canvas. Draw with a finger, stylus or mouse." width="900" height="900"></canvas>'
  +'<p id="ch3-status" role="status" class="small muted"></p>'
  +'<div class="ch3-tools" role="group" aria-label="Drawing tools"><button class="btn secondary" data-ch="undo">'+icon('undo')+'Undo</button><button class="btn secondary" data-ch="redo">Redo</button><button class="btn secondary" data-ch="clear">Clear</button></div>'
  +'<div class="ch3-options"><div class="ch3-row" role="group" aria-label="Ink colour">'+swatches()+'</div>'
  +'<div class="ch3-row" role="group" aria-label="Pen width">'+[8,14,22].map((w,i)=>'<button class="ch3-pill" data-ch="width" data-value="'+w+'" aria-pressed="'+(w===width)+'">'+['Fine','Medium','Broad'][i]+'</button>').join('')+'</div>'
  +'<div class="ch3-row" role="group" aria-label="Paper"><button class="ch3-pill" data-ch="paper" data-value="cream" aria-pressed="'+(paper==='cream')+'">Cream</button><button class="ch3-pill" data-ch="paper" data-value="warm" aria-pressed="'+(paper==='warm')+'"'+(warm?'':' disabled')+'>Warm paper'+(warm?'':' (locked)')+'</button></div>'
  +'<div class="ch3-row"><button class="ch3-pill" data-ch="grid" aria-pressed="'+grid+'">Dot grid</button><button class="ch3-pill" data-ch="border" aria-pressed="'+borderOn+'"'+(border?'':' disabled')+'>Framed border'+(border?'':' (locked)')+'</button></div></div>'
  +'<button class="btn wide" data-ch="save">Add to my exhibition</button>'+(notice?'<p class="ch3-notice" role="status">'+esc(notice)+'</p>':'')+'</div>';
 }
 function borderSvg(){return '<g class="ch3-border" fill="none" stroke="#b08a3e"><rect x="26" y="26" width="948" height="948" stroke-width="6"/><rect x="46" y="46" width="908" height="908" stroke-width="2"/>'+[[26,26],[974,26],[26,974],[974,974]].map(([x,y])=>'<rect x="'+(x-11)+'" y="'+(y-11)+'" width="22" height="22" transform="rotate(45 '+x+' '+y+')" fill="#b08a3e" stroke="none"/>').join('')+'</g>';}
 function pieceSvg(p,label){
  return '<svg viewBox="0 0 1000 1000" role="img" aria-label="'+esc(label)+'"><rect width="1000" height="1000" fill="'+CHAPTER3_PAPERS[p.paper]+'"/>'+(p.border?borderSvg():'')+'<g fill="none" stroke-linecap="round" stroke-linejoin="round">'+p.strokes.map(s=>'<polyline points="'+s.points.map(q=>q.join(',')).join(' ')+'" stroke="'+s.color+'" stroke-width="'+s.width+'"/>').join('')+'</g></svg>';
 }
 function exhibition(){
  const list=state.pieces;
  return '<div class="chapter3" data-ch3-view="exhibition"><button class="textbtn" data-ch="hub">'+icon('back')+'Chapter 3</button>'
  +'<header class="ch3-head"><span class="eyebrow">Exhibition</span><h1 id="ch3-title" tabindex="-1">My exhibition</h1><p>'+(list.length?list.length+' of '+CHAPTER3_MAX_PIECES+' pieces, newest first. Saved on this device and included in your progress backup.':'Your pieces will appear here.')+'</p></header>'
  +(list.length?'<ul class="ch3-shelf">'+list.map((p,i)=>'<li class="ch3-piece">'+pieceSvg(p,'Piece '+(list.length-i)+', made '+fmt(p.date))+'<div class="ch3-piece-meta"><span>'+fmt(p.date)+'</span>'+chip('Piece completed','on')+'</div><div class="ch3-piece-actions"><button class="btn secondary" data-ch="download" data-id="'+p.id+'">Download image</button>'+(confirming===p.id?'<button class="btn danger" data-ch="confirm-remove" data-id="'+p.id+'">Remove it</button><button class="btn secondary" data-ch="cancel-remove">Keep</button>':'<button class="btn secondary" data-ch="remove" data-id="'+p.id+'">Remove</button>')+'</div></li>').join('')+'</ul>'
   :'<button class="btn" data-ch="compose">Make a composition</button>')
  +(notice?'<p class="ch3-notice" role="status">'+esc(notice)+'</p>':'')+'</div>';
 }
 const body=()=>view==='story'?story():view==='compose'?compose():view==='exhibition'?exhibition():hub();

 /* ---------- composition canvas ---------- */
 const sw=()=>canvas?canvas.width/1000:1;
 function paint(){
  frame=0;if(!canvas?.isConnected)return;const c=canvas.getContext('2d'),s=sw();c.setTransform(1,0,0,1,0,0);c.fillStyle=CHAPTER3_PAPERS[paper];c.fillRect(0,0,canvas.width,canvas.height);
  if(grid){c.fillStyle='#b08a3e55';for(let x=100;x<1000;x+=100)for(let y=100;y<1000;y+=100){c.beginPath();c.arc(x*s,y*s,3*s,0,7);c.fill();}}
  if(borderOn&&unlocked('border')){c.strokeStyle='#b08a3e';c.lineWidth=6*s;c.strokeRect(26*s,26*s,948*s,948*s);c.lineWidth=2*s;c.strokeRect(46*s,46*s,908*s,908*s);c.fillStyle='#b08a3e';for(const [x,y] of [[26,26],[974,26],[26,974],[974,974]]){c.save();c.translate(x*s,y*s);c.rotate(Math.PI/4);c.fillRect(-11*s,-11*s,22*s,22*s);c.restore();}}
  c.lineCap='round';c.lineJoin='round';for(const st of [...draft.strokes,...(active?[active]:[])]){c.strokeStyle=st.color;c.lineWidth=st.width*s;c.beginPath();atSmoothXY(st.points).forEach((p,i)=>i?c.lineTo(p[0]*s,p[1]*s):c.moveTo(p[0]*s,p[1]*s));if(st.points.length===1)c.lineTo(st.points[0][0]*s+.01,st.points[0][1]*s);c.stroke();}
 }
 const request=()=>{if(!frame)frame=requestAnimationFrame(paint);};
 const status=m=>{const e=document.getElementById('ch3-status');if(e)e.textContent=m||(draft.strokes.length?draft.strokes.length+(draft.strokes.length===1?' stroke':' strokes'):'Draw with a finger, stylus or mouse. Saved on this device only.');};
 function sync(){
  const q=a=>document.querySelector('[data-ch="'+a+'"]');if(!q('undo'))return;
  q('undo').disabled=!draft.strokes.length;q('redo').disabled=!draft.redo.length;q('clear').disabled=!draft.strokes.length;q('save').disabled=!draft.strokes.length;
  document.querySelectorAll('[data-ch="color"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===color)));
  document.querySelectorAll('[data-ch="width"]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.value)===width)));
  document.querySelectorAll('[data-ch="paper"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===paper)));
  q('grid').setAttribute('aria-pressed',String(grid));q('border').setAttribute('aria-pressed',String(borderOn));status();request();
 }
 function setupCanvas(){
  observer?.disconnect();cancelAnimationFrame(frame);frame=0;active=null;pointer=null;
  canvas=document.getElementById('ch3-canvas');if(!canvas)return;
  const fit=()=>{const d=Math.min(devicePixelRatio||1,3),n=Math.max(300,Math.round(canvas.clientWidth*d));if(canvas.width!==n){canvas.width=n;canvas.height=n;}request();};
  observer=new ResizeObserver(fit);observer.observe(canvas);fit();
  guard=guardCanvasPointer(canvas,()=>{active=null;pointer=null;status('Writing area changed. Completed strokes are kept; restart this stroke.');request();});
  const pt=e=>{const r=canvas.getBoundingClientRect();return [Math.max(-20,Math.min(1020,(e.clientX-r.left)/r.width*1000)),Math.max(-20,Math.min(1020,(e.clientY-r.top)/r.height*1000))];};
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0||active)return;pointer=e.pointerId;try{canvas.setPointerCapture(e.pointerId);}catch{}active={color,width,points:[pt(e)]};e.preventDefault();request();});
  canvas.addEventListener('pointermove',e=>{if(!active||e.pointerId!==pointer)return;for(const ev of (e.getCoalescedEvents?.()||[e]))active.points.push(pt(ev));request();});
  const end=e=>{if(!active||e.pointerId!==pointer)return;const s=active;active=null;pointer=null;try{canvas.releasePointerCapture(e.pointerId);}catch{}if(s.points.length===1)s.points.push([s.points[0][0]+.01,s.points[0][1]]);if(draft.strokes.length<48){draft.strokes.push(s);draft.redo=[];announce('Stroke added.');}else status('This composition has the maximum of 48 strokes.');sync();};
  canvas.addEventListener('pointerup',end);
  sync();
 }
 function exportPng(p){
  const c=document.createElement('canvas');c.width=c.height=1200;const x=c.getContext('2d'),s=1.2;x.fillStyle=CHAPTER3_PAPERS[p.paper];x.fillRect(0,0,1200,1200);
  if(p.border){x.strokeStyle='#b08a3e';x.lineWidth=6*s;x.strokeRect(26*s,26*s,948*s,948*s);x.lineWidth=2*s;x.strokeRect(46*s,46*s,908*s,908*s);x.fillStyle='#b08a3e';for(const [a,b] of [[26,26],[974,26],[26,974],[974,974]]){x.save();x.translate(a*s,b*s);x.rotate(Math.PI/4);x.fillRect(-11*s,-11*s,22*s,22*s);x.restore();}}
  x.lineCap='round';x.lineJoin='round';for(const st of p.strokes){x.strokeStyle=st.color;x.lineWidth=st.width*s;x.beginPath();atSmoothXY(st.points).forEach((q,i)=>i?x.lineTo(q[0]*s,q[1]*s):x.moveTo(q[0]*s,q[1]*s));x.stroke();}
  x.fillStyle='#56685e';x.font='24px system-ui,sans-serif';x.textAlign='center';x.fillText('Khatti · Chapter 3 · '+fmt(p.date),600,1160);
  c.toBlob(b=>{if(b)download(b,'Khatti-Chapter3-'+p.id.slice(0,8)+'.png');else toast('Could not create the image.');},'image/png');
 }

 /* ---------- events ---------- */
 const go=v=>{view=v;notice=readable?'':notice;confirming=null;rerender();};
 document.addEventListener('click',e=>{
  const el=e.target.closest('[data-ch]');if(!el||el.disabled||!document.querySelector('.chapter3'))return;const a=el.dataset.ch,id=el.dataset.id,val=el.dataset.value;
  switch(a){
   case'hub':case'compose':case'exhibition':go(a);break;
   case'story':storyIndex=0;replayKey++;go('story');break;
   case'story-next':storyIndex=Math.min(storyIndex+1,CHAPTER3_STORY.length-1);rerender();break;
   case'story-prev':storyIndex=Math.max(storyIndex-1,0);rerender();break;
   case'story-replay':replayKey++;rerender();break;
   case'story-finish':state={...state,explored:true};save();toast('Explored');go('hub');break;
   case'lesson':openLesson(id);break;
   case'undo':{const s=draft.strokes.pop();if(s)draft.redo.push(s);sync();break;}
   case'redo':{const s=draft.redo.pop();if(s)draft.strokes.push(s);sync();break;}
   case'clear':draft={strokes:[],redo:[]};sync();announce('Composition cleared.');break;
   case'color':color=val;sync();break;
   case'width':width=Number(val);sync();break;
   case'paper':if(val==='cream'||unlocked('paper')){paper=val;sync();}break;
   case'grid':grid=!grid;sync();break;
   case'border':if(unlocked('border')){borderOn=!borderOn;sync();}break;
   case'save':{if(!draft.strokes.length)break;const piece=makePiece({id:uuid(),date:new Date().toISOString(),strokes:draft.strokes,paper:unlocked('paper')?paper:'cream',border:borderOn&&unlocked('border')}),r=addPiece(state,piece);
    if(!r.ok){notice='Your exhibition holds '+CHAPTER3_MAX_PIECES+' pieces. Remove one to add another.';rerender();break;}
    state=r.state;const ok=save();draft={strokes:[],redo:[]};if(ok)notice='';toast('Piece completed');go('exhibition');break;}
   case'download':{const p=state.pieces.find(p=>p.id===id);if(p)exportPng(p);break;}
   case'remove':confirming=id;rerender();break;
   case'cancel-remove':confirming=null;rerender();break;
   case'confirm-remove':state=removePiece(state,id);confirming=null;save();announce('Piece removed.');rerender();break;
  }
 });
 return {
  open(){view='hub';notice=readable?'':notice;},
  body,hero,
  after(){const h=document.getElementById('ch3-title');if(h)h.focus({preventScroll:true});if(view==='compose')setupCanvas();else{observer?.disconnect();canvas=null;}},
  snapshot:()=>({view,state:structuredClone(state),draftStrokes:draft.strokes.length,readable})
 };
}
