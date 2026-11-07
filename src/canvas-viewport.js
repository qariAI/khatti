/** CSS-pixel viewport transforms; persisted lesson/ink coordinates never change. */
export function fitPracticeViewport(bounds,width,height,{top=0,bottom=0,left=16,right=16,padding=28,minSpan=180}={}){
 const bw=Math.max(minSpan,bounds.width+padding*2),bh=Math.max(minSpan,bounds.height+padding*2),cx=bounds.x+bounds.width/2,cy=bounds.y+bounds.height/2;
 const usableWidth=Math.max(1,width-left-right),usableHeight=Math.max(1,height-top-bottom),scale=Math.min(usableWidth/bw,usableHeight/bh);
 return{scale,x:left+usableWidth/2-cx*scale,y:top+usableHeight/2-cy*scale};
}
export function logicalCanvasPoint(view,x,y){return[(x-view.x)/view.scale,(y-view.y)/view.scale];}
export function canvasGeometry(rect){return{left:rect.left,top:rect.top,width:rect.width,height:rect.height};}
export function sameCanvasGeometry(a,b){return !!a&&!!b&&['width','height'].every(k=>Math.abs(a[k]-b[k])<=2);}
// One lifecycle listener per document; weak references avoid retaining removed canvases.
const canvasGuards=new Set();let canvasLifecycle=false,penOwner=null,penLifted=-Infinity;
export function announce(message){if(typeof document==='undefined')return;let el=document.getElementById('harf-announcer');if(!el){el=document.createElement('div');el.id='harf-announcer';el.className='sr-only';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.setAttribute('aria-atomic','true');document.body.append(el);}el.textContent='';queueMicrotask(()=>{el.textContent=message;});}
/** Best-effort pen/touch filtering, with no layout reads on pointermove. */
export function guardCanvasPointer(canvas,onInterrupt){
 const main=canvas.closest?.('main');if(main&&!main.querySelector('h1')){const title=document.createElement('h1');title.className='sr-only';title.textContent=canvas.getAttribute('aria-label')?.split('.')[0]||'Writing canvas';main.prepend(title);}
 let owner=null,geometry=null,cached=null;
 const captured=id=>{try{return canvas.hasPointerCapture(id);}catch{return false;}};
 const endPen=id=>{if(penOwner===id){penOwner=null;penLifted=Date.now();}};
 const interrupt=()=>{if(owner===null)return;const id=owner;owner=null;geometry=null;endPen(id);onInterrupt();try{if(captured(id))canvas.releasePointerCapture(id);}catch{}};
 const reset=()=>{interrupt();if(penOwner!==null){penOwner=null;penLifted=Date.now();}};
 if(typeof window!=='undefined'){
  const ref=new WeakRef({canvas,reset}); // Keep record alive only while its canvas is alive.
  canvas.__harfPointerGuard=ref.deref();canvasGuards.add(ref);
  if(!canvasLifecycle){canvasLifecycle=true;const clear=()=>{for(const r of canvasGuards){const entry=r.deref();if(!entry||!entry.canvas.isConnected){canvasGuards.delete(r);continue;}entry.reset();}};window.addEventListener('blur',clear);window.addEventListener('pagehide',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});}
 }
 if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(entries=>{const r=entries[0]?.contentRect;if(!r)return;cached={width:r.width,height:r.height};if(owner!==null&&!sameCanvasGeometry(geometry,cached))interrupt();});ro.observe(canvas);}
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  if(owner!==null){if(captured(owner)){e.stopImmediatePropagation();return;}interrupt();}
  if(e.pointerType==='touch'&&(penOwner!==null||Date.now()-penLifted<1000)){e.preventDefault();e.stopImmediatePropagation();const message='Pen just used — touch resumes in a moment';const status=main?.querySelector('[role="status"]');if(status)status.textContent=message;announce(message);return;}
  if(e.pointerType==='pen'){penOwner=e.pointerId;}
  owner=e.pointerId;geometry=canvasGeometry(canvas.getBoundingClientRect());cached=geometry;
 },{capture:true});
 canvas.addEventListener('pointermove',e=>{if(owner!==null&&e.pointerId===owner&&cached&&!sameCanvasGeometry(geometry,cached)){e.stopImmediatePropagation();interrupt();}},{capture:true});
 canvas.addEventListener('pointerup',e=>{if(owner===null||e.pointerId!==owner)return;if(!sameCanvasGeometry(geometry,canvasGeometry(canvas.getBoundingClientRect()))){e.stopImmediatePropagation();interrupt();return;}endPen(owner);owner=null;geometry=null;},{capture:true});
 for(const type of ['pointercancel','lostpointercapture'])canvas.addEventListener(type,e=>{if(owner===null||e.pointerId!==owner){e.stopImmediatePropagation();return;}interrupt();e.stopImmediatePropagation();},{capture:true});
 return{cancel:interrupt};
}
