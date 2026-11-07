
/* Pure, platform-independent geometry/evaluation. Scores are prototype estimates. */

'use strict';
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const validPoints=p=>Array.isArray(p)&&p.length>0&&p.every(a=>a&&Number.isFinite(a.x)&&Number.isFinite(a.y));
function length(p){let n=0;for(let i=1;i<p.length;i++)n+=dist(p[i-1],p[i]);return n;}
function resample(p,count=70){if(!p.length)return[];if(p.length===1)return Array.from({length:count},()=>({...p[0]}));const cum=[0];for(let i=1;i<p.length;i++)cum.push(cum[i-1]+dist(p[i-1],p[i]));const total=cum.at(-1);if(total<.001)return Array.from({length:count},()=>({...p[0]}));let j=1;return Array.from({length:count},(_,i)=>{const d=total*i/(count-1);while(j<cum.length-1&&cum[j]<d)j++;const t=(d-cum[j-1])/(cum[j]-cum[j-1]||1);return{x:p[j-1].x+(p[j].x-p[j-1].x)*t,y:p[j-1].y+(p[j].y-p[j-1].y)*t};});}
function nearestHint(a,p,hint){let best=Infinity,index=0;for(let i=0;i<p.length;i++){const d=dist(a,p[i]);if(d<best-1e-6||Math.abs(d-best)<=1e-6&&Math.abs(i-hint)<Math.abs(index-hint)){best=d;index=i;}}return{distance:best,index};}
function nearest(a,p){let best=Infinity,index=0;for(let i=0;i<p.length;i++){const d=dist(a,p[i]);if(d<best){best=d;index=i;}}return{distance:best,index};}
function dtw(a,b,band=18){const n=a.length,m=b.length;let prev=new Float64Array(m+1).fill(Infinity);prev[0]=0;for(let i=1;i<=n;i++){const cur=new Float64Array(m+1).fill(Infinity);for(let j=Math.max(1,i-band);j<=Math.min(m,i+band);j++)cur[j]=dist(a[i-1],b[j-1])+Math.min(prev[j],cur[j-1],prev[j-1]);prev=cur;}return prev[m]/Math.max(n,m);}

function markIdentity(points,target){const id=target.id||'';if(!/sukun|shadda|dagger/.test(id))return true;const u=resample(points),r=resample(target.points);
// Preserve evidence of dense retracing that fixed-count resampling can hide.
if(length(points)>Math.max(1,length(u))*1.35)return false;
const bounds=a=>{const xs=a.map(p=>p.x),ys=a.map(p=>p.y);return{w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};},ub=bounds(u),rb=bounds(r),diag=Math.hypot(rb.w,rb.h),ud=Math.hypot(ub.w,ub.h);if(ud<diag*.6||ud>diag*1.65)return false;const center=a=>({x:a.reduce((v,p)=>v+p.x,0)/a.length,y:a.reduce((v,p)=>v+p.y,0)/a.length}),uc=center(u),rc=center(r),scale=diag/ud,nu=u.map(p=>({x:(p.x-uc.x)*scale,y:(p.y-uc.y)*scale})),nr=r.map(p=>({x:p.x-rc.x,y:p.y-rc.y}));const err=dtw(nu,nr)/Math.max(1,diag);if(/sukun/.test(id)){let area=0;for(let i=0;i<u.length;i++){const a=u[i],b=u[(i+1)%u.length];area+=a.x*b.y-b.x*a.y;}const len=length(u),ratio=Math.min(ub.w,ub.h)/Math.max(1,ub.w,ub.h);return ratio>=.55&&Math.abs(area/2)/(len*len)>=.04&&dist(u[0],u.at(-1))<=len*.18&&err<=.17;}
if(/dagger/.test(id)){const start=u[0],end=u.at(-1),direct=dist(start,end);return end.y>start.y&&Math.abs(end.y-start.y)>=Math.abs(end.x-start.x)*2&&length(u)/Math.max(1,direct)<=1.35&&err<=.12;}
return ub.w>=ub.h*.65&&ub.w>=22&&ub.h>=12&&err<=.16;
}

function strokeMetric(user,target,tolerance=34,input=user?.input||'touch'){
 if(!target||!validPoints(target.points)||!validPoints(user?.points))return{shape:0,direction:0,placement:0,coverage:0,precision:0,qualified:false,reason:user?.points?.length?'shape':'missing'};
 const isMark=target.assessmentRole==='mark'||Number.isFinite(target.tolerance)&&target.tolerance<=23;
 const fingerMark=isMark&&input!=='pen';
 const touchTolerance=target.kind==='press'?35:/sukun/.test(target.id)?30:/shadda|dagger/.test(target.id)?28:32;
 tolerance=fingerMark?touchTolerance:(target.tolerance??tolerance);
 const minCoverage=fingerMark?.70:.85,minPrecision=fingerMark?.65:.75,minLength=fingerMark?.65:.75;
 if(!user?.points?.length)return{shape:0,direction:0,placement:0,coverage:0,precision:0,qualified:false,reason:'missing'};
 const p=user.points;
 if(target.kind==='press'){
  const centroid={x:p.reduce((a,b)=>a+b.x,0)/p.length,y:p.reduce((a,b)=>a+b.y,0)/p.length};
  const d=dist(centroid,target.points[0]);const extent=Math.max(...p.map(a=>dist(a,centroid)));const shape=clamp(1-d/(tolerance*2))*clamp(1-Math.max(0,extent-18)/60);const dotExtent=isMark?(input==='pen'?18:20):40,dotLength=isMark?(input==='pen'?45:65):100;const ok=d<=tolerance&&extent<dotExtent&&length(p)<dotLength;
  return{shape,direction:null,placement:clamp(1-d/(tolerance*3)),coverage:ok?1:0,precision:shape,qualified:ok,reason:ok?'good':'dot'};
 }
 if(p.length<2||length(p)<8)return{shape:0,direction:0,placement:0,coverage:0,precision:0,qualified:false,reason:'short'};
 const u=resample(p),r=resample(target.points);const closedMark=fingerMark&&dist(r[0],r.at(-1))<3&&length(r)>40;const center=a=>({x:a.reduce((v,p)=>v+p.x,0)/a.length,y:a.reduce((v,p)=>v+p.y,0)/a.length});const uc=closedMark?center(u):{x:0,y:0},rc=closedMark?center(r):{x:0,y:0},loopOffset={x:uc.x-rc.x,y:uc.y-rc.y};let hitU=0,hitR=0;const projection=[];
 for(let ui=0;ui<u.length;ui++){const a=u[ui],n=nearestHint(a,r,ui);if(n.distance<=tolerance)hitU++;projection.push(closedMark?nearestHint({x:a.x-loopOffset.x,y:a.y-loopOffset.y},r,ui).index:n.index);}
 for(const a of r)if(nearest(a,u).distance<=tolerance)hitR++;
 const precision=hitU/u.length,coverage=hitR/r.length;
 let forward=0,backward=0;for(let i=1;i<projection.length;i++){const d=projection[i]-projection[i-1];if(d>0)forward+=d;else backward-=d;}
 const start=dist(u[0],r[0]),end=dist(u.at(-1),r.at(-1));const traversal=forward/(forward+backward||1);
 const direction=clamp(traversal)*clamp(1-start/(tolerance*4));
 const ratio=length(p)/(length(target.points)||1);const lengthPenalty=clamp(1-Math.max(0,ratio-1.3)/1.5);
 const alignment=clamp(1-dtw(u,r)/(tolerance*4));
 const shape=(precision+coverage)/2*(.65+.35*alignment)*lengthPenalty;
 const placement=clamp(1-(start+end)/(tolerance*8));
 const loopComplete=!closedMark||dist(u[0],u.at(-1))<=Math.max(12,tolerance*.65);const identityOK=markIdentity(p,target);const qualified=identityOK&&loopComplete&&coverage>=minCoverage&&precision>=minPrecision&&direction>=.7&&start<=tolerance*1.8&&end<=tolerance*1.8&&ratio>=minLength&&ratio<=1.7;
 let reason='good';if(!identityOK)reason='shape';else if(!loopComplete)reason='coverage';else if(precision<.3&&coverage<.3)reason='shape';else if(start>tolerance*1.8&&coverage>.7)reason='start';else if(direction<.7)reason='direction';else if(coverage<minCoverage||ratio<minLength)reason='coverage';else if(precision<minPrecision||ratio>1.7)reason='shape';else if(end>tolerance*1.8)reason='end';
 return{shape,direction,placement,coverage,precision,qualified,reason};
}
function evaluate(strokes,lesson,input='touch'){
 const variants=lesson.variants||[lesson.strokes.map(s=>s.id)];const byId=Object.fromEntries(lesson.strokes.map(s=>[s.id,s]));const tolerance=input==='pen'?27:38;
 const scores=variants.map(sequence=>{const metrics=sequence.map((id,i)=>strokeMetric(strokes[i],byId[id],tolerance,input));const n=metrics.length;
 const shape=metrics.reduce((a,m)=>a+m.shape,0)/n;const directions=metrics.filter(m=>m.direction!==null);const direction=directions.length?directions.reduce((a,m)=>a+m.direction,0)/directions.length:null;
 const placement=metrics.reduce((a,m)=>a+m.placement,0)/n;const coverage=metrics.reduce((a,m)=>a+m.coverage,0)/n;
 const extra=Math.max(0,strokes.length-n);const sequenceScore=metrics.filter(m=>m.qualified).length/n;
 const applicable=[{key:'shape',v:shape,w:.45},{key:'direction',v:direction,w:.2},{key:'sequence',v:sequenceScore,w:.15},{key:'placement',v:placement,w:.2}].filter(m=>m.v!==null);
 const score=Math.round(100*applicable.reduce((a,m)=>a+m.v*m.w,0)/applicable.reduce((a,m)=>a+m.w,0)*Math.max(.1,1-extra*.18));
 const markOnly=sequence.every(id=>Number.isFinite(byId[id].tolerance)&&byId[id].tolerance<=23);const minimumScore=input!=='pen'&&markOnly?60:80;const qualified=strokes.length===n&&metrics.every(m=>m.qualified)&&score>=minimumScore;
 const bad=metrics.findIndex(m=>!m.qualified);const reason=extra?'extra':bad>=0?metrics[bad].reason:'good';
 return{score,qualified,metrics,coverage,shape,direction,placement,sequenceScore,reason,badIndex:bad,sequence,extra,version:'prototype-geometry-4-mark-retracing',silhouette:null};});
 return scores.sort((a,b)=>Number(b.qualified)-Number(a.qualified)||b.score-a.score)[0];
}
function hull(points){const p=points.slice().sort((a,b)=>a.x-b.x||a.y-b.y);const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);const lower=[],upper=[];for(const a of p){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),a)<=0)lower.pop();lower.push(a);}for(let i=p.length-1;i>=0;i--){const a=p[i];while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),a)<=0)upper.pop();upper.push(a);}lower.pop();upper.pop();return lower.concat(upper);}
export {dist,clamp,length,resample,nearest,dtw,strokeMetric,evaluate,hull};

