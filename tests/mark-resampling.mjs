import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strokeMetric,resample} from '../src/engine.js';
import {hydrateLessons} from '../src/lesson-data.js';
const {Q_LESSONS,ALLAH_LESSONS}=hydrateLessons(JSON.parse(readFileSync(new URL('../data/lessons.json',import.meta.url))));
const marks=[Q_LESSONS.at(-1).strokes.find(s=>s.id==='sin-sukun'),...ALLAH_LESSONS.at(-1).strokes.filter(s=>['shadda','dagger-alif'].includes(s.id))];
let checks=0;
for(const target of marks){
 for(const input of ['touch','pen'])for(const count of [35,140,700]){
  const points=resample(target.points,count);
  assert(strokeMetric({points},target,38,input).qualified,`${target.id}: ${count} samples / ${input}`);checks++;
  assert(strokeMetric({points:points.flatMap(p=>[p,p,p])},target,38,input).qualified,'duplicate pointer samples');checks++;
 }
 // Alternate tiny excursions around the correct path. At high sample density,
 // a fixed-count resample can conceal hundreds of these unwanted movements.
 const dense=resample(target.points,1400).map((p,i)=>({x:p.x+(i%2?2:-2),y:p.y}));
 for(const input of ['touch','pen']){assert(!strokeMetric({points:dense},target,38,input).qualified,`${target.id}: dense scribble / ${input}`);checks++;}
 for(const points of [[{x:NaN,y:0}],[{x:0,y:Infinity}],[null],[{x:'1',y:2}]]){
  const metric=strokeMetric({points},target);assert.equal(metric.qualified,false);assert(Object.values(metric).filter(v=>typeof v==='number').every(Number.isFinite));checks++;
 }
 assert.equal(strokeMetric({points:target.points},{...target,points:[]}).qualified,false);checks++;
}
console.log(`PASS: ${checks} mark resampling, duplicate-event, dense-scribble and invalid-input checks (synthetic fixtures).`);
