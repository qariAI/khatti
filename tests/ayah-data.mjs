import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const d=JSON.parse(readFileSync(new URL('../data/ayah-course.json',import.meta.url))),source=readFileSync(new URL('../data/quran-source.txt',import.meta.url),'utf8'),rows=new Map(source.split('\n').filter(l=>/^\d+\|/.test(l)).map(l=>{const [s,a,...t]=l.split('|');return [s+':'+a,t.join('|')];}));
assert.equal(createHash('sha256').update(source).digest('hex'),d.source.excerptSha256);
assert.deepEqual(d.surahs.map(s=>[s.id,s.ayahs.length]),[[1,7],[112,4],[113,5],[114,6]]);
let lessons=0;for(const s of d.surahs)for(const a of s.ayahs){assert.equal(a.sourceText,rows.get(a.id));assert.equal(a.id,s.id+':'+a.number);assert(Number.isInteger(a.contentStart)&&a.contentStart>=0&&a.contentStart<a.sourceText.length);if(a.contentStart){assert.equal(a.number,1);assert.notEqual(s.id,1);assert.equal(a.sourceText.slice(0,a.contentStart),d.surahs[0].ayahs[0].sourceText+' ');}const text=a.sourceText.slice(a.contentStart),words=text.split(' ');assert(words.every(w=>w&&/[\u0600-\u06ff]/.test(w)));assert.equal(words.join(' '),text);assert.equal(a.wordLessons.length,words.length);for(let i=0;i<words.length;i++){assert.equal(a.wordLessons[i].id,a.id+':word-'+(i+1));assert.equal(a.wordLessons[i].text,words[i]);assert(a.wordLessons[i].focus.length>20);}lessons+=words.length+1;}
assert.equal(rows.size,22);assert.equal(lessons,109);assert.equal(d.review.reviewerId,null);assert.equal(d.review.writtenSignoff,null);assert(source.includes('CHANGING IT IS NOT ALLOWED'));assert(d.source.url==='https://tanzil.net');
console.log('PASS 22 exact source ayahs, numbering/Basmala boundaries, 109 lessons, source checksum and attribution');
