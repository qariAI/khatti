import assert from 'node:assert/strict';
import {fitPracticeViewport,logicalCanvasPoint,guardCanvasPointer} from '../src/canvas-viewport.js';
for(const [width,height] of [[320,700],[390,844],[667,320],[1440,900]]){const bounds={x:270,y:150,width:60,height:300},v=fitPracticeViewport(bounds,width,height,{top:90,bottom:104});for(const [x,y] of [[270,150],[330,450],[300,300]]){const p=logicalCanvasPoint(v,v.x+x*v.scale,v.y+y*v.scale);assert(Math.abs(p[0]-x)<1e-8);assert(Math.abs(p[1]-y)<1e-8);assert(v.y+y*v.scale>=90);assert(v.y+y*v.scale<=height-104);}assert(v.scale>0);}
const canvas=new EventTarget();let rect={left:0,top:0,width:300,height:500},interrupts=0,delivered=0;canvas.getBoundingClientRect=()=>rect;canvas.hasPointerCapture=()=>false;guardCanvasPointer(canvas,()=>interrupts++);canvas.addEventListener('pointercancel',()=>delivered++);const emit=(type,id)=>{const e=new Event(type);Object.defineProperties(e,{pointerId:{value:id},button:{value:0}});canvas.dispatchEvent(e);};emit('pointerdown',1);emit('pointercancel',99);assert.equal(interrupts,0);assert.equal(delivered,0);emit('pointermove',1);rect={...rect,width:310};emit('pointerup',1);assert.equal(interrupts,1);emit('lostpointercapture',1);assert.equal(interrupts,1);emit('pointerdown',2);emit('pointercancel',2);assert.equal(interrupts,2);
console.log('PASS viewport inversion, target clearance, active pointer ownership and pre-observer resize interruption');
// No pointermove rect reads; positional shifts are harmless; capture ownership recovers.
{
 const c=new EventTarget();let held=false,reads=0,cancels=0,down=0,r={left:0,top:0,width:300,height:500};
 c.getBoundingClientRect=()=>{reads++;return r;};c.hasPointerCapture=()=>held;c.releasePointerCapture=()=>{held=false;};guardCanvasPointer(c,()=>cancels++);c.addEventListener('pointerdown',()=>down++);
 const fire=(type,id=1,pointerType='mouse')=>{const e=new Event(type,{cancelable:true});Object.defineProperties(e,{pointerId:{value:id},button:{value:0},pointerType:{value:pointerType}});c.dispatchEvent(e);};
 fire('pointerdown');held=true;const initial=reads;for(let i=0;i<100;i++)fire('pointermove');assert.equal(reads,initial);r={...r,left:30,top:80,width:301};fire('pointerup');assert.equal(cancels,0);
 fire('pointerdown',2);held=true;fire('pointerdown',3);assert.equal(down,2);held=false;fire('pointerdown',3);assert.equal(down,3);assert.equal(cancels,1);fire('pointerup',3);
 const originalNow=Date.now;let now=originalNow();Date.now=()=>now;fire('pointerdown',4,'pen');held=true;fire('pointerup',4,'pen');fire('pointerdown',5,'touch');assert.equal(down,4,'touch is suppressed immediately after pen lift');now+=1001;fire('pointerdown',6,'touch');assert.equal(down,5,'touch resumes after one second');Date.now=originalNow;
 console.log('PASS cached move geometry, position tolerance, held/lost capture recovery and pen cooldown');
}
