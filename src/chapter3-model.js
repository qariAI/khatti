/** Chapter 3 pilot: pure model. Historical inspiration only; never a script-accuracy or mastery claim. */
export const CHAPTER3_KEY='harf.chapter3.v1';
export const CHAPTER3_MAX_PIECES=6,CHAPTER3_MAX_STROKES=48,CHAPTER3_MAX_POINTS=400;
export const CHAPTER3_EXERCISES=[
 {lessonId:'nuqta',title:'The dot as unit',doing:'Make one rhombic dot at the nib angle.'},
 {lessonId:'alif',title:'A stem, measured by eye',doing:'Draw Alif, then compare it with the model in the overlay.'},
 {lessonId:'ba',title:'Two strokes, one rhythm',doing:'Draw the bowl, then place the dot by eye.'}
];
/** Story cards. Draft text: every attribution is hedged and every card names the source still to be added. */
export const CHAPTER3_STORY=[
 {title:'A problem of measure',text:'Copyists needed letters that looked alike from one hand to the next. In Abbasid Baghdad, around the 10th century, the vizier and calligrapher Ibn Muqla is traditionally credited with a system of proportion.',source:'Source to add (S1)'},
 {title:'The dot as a ruler',text:'In that tradition the rhombic dot made by the width of the pen is the unit, and letters are measured in dots. Here you will make the dot first, then build from it.',source:'Source to add (S2)'},
 {title:'A system that outlived its makers',text:'Later masters refined the idea, and many traditions kept it. This is one thread in a story with many regions and scripts, not the whole of it.',source:'Source to add (S3)'}
];
export const CHAPTER3_PAPERS={cream:'#faf7ef',warm:'#f3e7c9'};
export const CHAPTER3_COLORS={base:['#125454','#303a63','#984d3b'],palette:['#5a4630','#7a3248']};
export const fresh=()=>({version:1,explored:false,pieces:[]});
const isNum=n=>Number.isFinite(n);
function validStroke(s){return !!s&&[8,14,22].includes(s.width)&&[...CHAPTER3_COLORS.base,...CHAPTER3_COLORS.palette].includes(s.color)&&Array.isArray(s.points)&&s.points.length>0&&s.points.length<=CHAPTER3_MAX_POINTS&&s.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>isNum(n)&&n>=-50&&n<=1050));}
export function validPiece(p){return !!p&&typeof p.id==='string'&&/^[\w-]{1,80}$/.test(p.id)&&isNum(Date.parse(p.date))&&['cream','warm'].includes(p.paper)&&typeof p.border==='boolean'&&Array.isArray(p.strokes)&&p.strokes.length>0&&p.strokes.length<=CHAPTER3_MAX_STROKES&&p.strokes.every(validStroke);}
export function validChapter3(v){return !!v&&v.version===1&&typeof v.explored==='boolean'&&Array.isArray(v.pieces)&&v.pieces.length<=CHAPTER3_MAX_PIECES&&v.pieces.every(validPiece)&&new Set(v.pieces.map(p=>p.id)).size===v.pieces.length;}
/** attempts: {lessonId: count}. Labels describe participation only. */
export function exerciseStates(attempts={}){return CHAPTER3_EXERCISES.map(e=>({...e,attempted:(Number(attempts[e.lessonId])||0)>0,label:(Number(attempts[e.lessonId])||0)>0?'Attempted':'Not yet'}));}
export function rewards(state,attempts={}){
 const a=id=>(Number(attempts[id])||0)>0;
 return [
  {id:'paper',title:'Warm paper tone',unlocked:a('nuqta'),rule:'Attempt “The dot as unit”.'},
  {id:'palette',title:'Walnut and madder inks',unlocked:a('ba'),rule:'Attempt “Two strokes, one rhythm”.'},
  {id:'border',title:'Framed border',unlocked:state.pieces.length>0,rule:'Save your first piece to the exhibition.'}
 ];
}
export function chapterLabel(state,attempts={}){return state.pieces.length?'Piece completed':exerciseStates(attempts).some(e=>e.attempted)?'Attempted':state.explored?'Explored':'Not started';}
/** Drop near-duplicate points and cap the length, always keeping the first and last point. */
export function simplify(points,minGap=1.5,max=CHAPTER3_MAX_POINTS){
 const out=[];for(const p of points){const l=out.at(-1);if(!l||Math.hypot(p[0]-l[0],p[1]-l[1])>=minGap)out.push(p);}
 if(points.length&&out.at(-1)!==points.at(-1)&&(out.length===1||Math.hypot(points.at(-1)[0]-out.at(-1)[0],points.at(-1)[1]-out.at(-1)[1])>0))out.push(points.at(-1));
 if(out.length<=max)return out.map(p=>[Math.round(p[0]*10)/10,Math.round(p[1]*10)/10]);
 const step=(out.length-1)/(max-1),res=[];for(let i=0;i<max;i++)res.push(out[Math.round(i*step)]);
 return res.map(p=>[Math.round(p[0]*10)/10,Math.round(p[1]*10)/10]);
}
export function makePiece({id,date,strokes,paper,border}){
 return {id,date,paper:paper==='warm'?'warm':'cream',border:!!border,strokes:strokes.slice(0,CHAPTER3_MAX_STROKES).map(s=>({width:s.width,color:s.color,points:simplify(s.points)}))};
}
/** Newest first; a full shelf refuses rather than silently replacing a piece. */
export function addPiece(state,piece){
 if(state.pieces.length>=CHAPTER3_MAX_PIECES)return {ok:false,reason:'full',state};
 return {ok:true,state:{...state,pieces:[piece,...state.pieces]}};
}
export function removePiece(state,id){return {...state,pieces:state.pieces.filter(p=>p.id!==id)};}
