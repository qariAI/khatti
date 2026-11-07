import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hydrateLessons} from '../src/lesson-data.js';
const data=JSON.parse(readFileSync(new URL('../data/lessons.json',import.meta.url))),before=JSON.stringify(data),a=hydrateLessons(data),b=hydrateLessons(data);
assert.equal(a.LESSONS.length,22);assert.equal(a.FOUNDATIONS.length,9);assert.equal(a.Q_LESSONS.length,6);assert.equal(a.ALLAH_LESSONS.length,3);assert.equal(a.CALIBRATION_LESSONS.length,4);
assert.equal(a.STUDIES.bism.lessons[0],a.Q_LESSONS[0]);assert.notEqual(a.Q_LESSONS[0],b.Q_LESSONS[0]);assert.equal(JSON.stringify(data),before);
for(const l of a.LESSONS){const ids=new Set(l.strokes.map(s=>s.id));assert.equal(ids.size,l.strokes.length);for(const st of [...l.strokes,...l.contextStrokes||[]]){assert(st.points.length>0);assert(st.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));}for(const variant of l.variants){assert.equal(variant.length,l.strokes.length);assert.equal(new Set(variant).size,variant.length);assert(variant.every(id=>ids.has(id)));}}
for(const file of ['engine.js','lesson-data.js','ui.js'])assert(!/createElementNS|getTotalLength|getPointAtLength/.test(readFileSync(new URL('../src/'+file,import.meta.url),'utf8')));
assert(!/\b(document|window|localStorage)\b/.test(readFileSync(new URL('../src/engine.js',import.meta.url),'utf8')));
console.log('PASS catalog integrity, shared references, hydration isolation and DOM-free engine/runtime');
