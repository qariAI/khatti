import assert from 'node:assert/strict';
import {fresh,validChapter3,exerciseStates,rewards,chapterLabel,simplify,makePiece,addPiece,removePiece,CHAPTER3_MAX_PIECES,CHAPTER3_COLORS} from '../src/chapter3-model.js';
const stroke=(n=3,c=CHAPTER3_COLORS.base[0])=>({width:14,color:c,points:Array.from({length:n},(_,i)=>[100+i*10,200])});
let s=fresh();assert(validChapter3(s));
assert.equal(chapterLabel(s,{}),'Not started');
assert.equal(chapterLabel({...s,explored:true},{}),'Explored');
assert.equal(chapterLabel(s,{nuqta:1}),'Attempted');
assert(rewards(s,{}).every(r=>!r.unlocked));
assert(rewards(s,{nuqta:1}).find(r=>r.id==='paper').unlocked);
assert(rewards(s,{ba:2}).find(r=>r.id==='palette').unlocked);
assert(exerciseStates({alif:1}).find(e=>e.lessonId==='alif').attempted);
const mk=i=>makePiece({id:'p'+i,date:new Date().toISOString(),strokes:[stroke()],paper:'cream',border:false});
for(let i=0;i<CHAPTER3_MAX_PIECES;i++){const r=addPiece(s,mk(i));assert(r.ok);s=r.state;}
assert(validChapter3(s));assert.equal(s.pieces[0].id,'p'+(CHAPTER3_MAX_PIECES-1));
assert.equal(addPiece(s,mk(99)).ok,false);assert.equal(s.pieces.length,CHAPTER3_MAX_PIECES);
assert.equal(removePiece(s,'p0').pieces.length,CHAPTER3_MAX_PIECES-1);
assert.equal(chapterLabel(s,{}),'Piece completed');
assert(rewards(s,{}).find(r=>r.id==='border').unlocked);
// simplify caps and keeps endpoints
const long=Array.from({length:2000},(_,i)=>[i/2,100]);const sim=simplify(long);assert(sim.length<=400);assert.deepEqual(sim[0],[0,100]);assert.deepEqual(sim.at(-1),[999.5,100]);
// validation rejects tampering
const bad=v=>assert.equal(validChapter3(v),false);
bad(null);bad({...fresh(),version:2});bad({...fresh(),pieces:Array(7).fill(mk(1))});
const p=mk(1);bad({...fresh(),pieces:[{...p,paper:'red'}]});
bad({...fresh(),pieces:[{...p,strokes:[{...p.strokes[0],color:'#ff0000'}]}]});
bad({...fresh(),pieces:[{...p,strokes:[{...p.strokes[0],width:99}]}]});
bad({...fresh(),pieces:[{...p,strokes:[{...p.strokes[0],points:[[5000,0]]}]}]});
bad({...fresh(),pieces:[{...p,strokes:[]}]});
bad({...fresh(),pieces:[p,p]});
bad({...fresh(),pieces:[{...p,id:'<script>'}]});
console.log('chapter3-model ok');
