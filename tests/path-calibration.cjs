/* Simulated attempts of known quality must land in the right star bands (see SP_CFG in src/path.js).
   The pen path is the model glyph's skeleton plus drift/noise, so this checks ordering and bands, not human feel. */
const {chromium}=require('playwright');const {spawn}=require('child_process');const PORT=process.env.PORT||6052;
(async()=>{const srv=spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT},stdio:'ignore'});await new Promise(r=>setTimeout(r,1500));
const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1000,height:700}});const as=(c,m)=>{if(!c){console.log('FAIL',m);process.exitCode=1;}};
await pg.goto('http://localhost:'+PORT+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await pg.waitForTimeout(900);
const r=await pg.evaluate(async()=>{const P=__khattiPath;let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647,gauss=()=>{let u=0;for(let i=0;i<6;i++)u+=rnd();return (u-3)/Math.sqrt(.5);};
 const V={careful:{sd:4,dx:0,dy:0,sc:1},sloppy:{sd:11,dx:14,dy:8,sc:.9},off:{sd:8,dx:25,dy:12,sc:1},small:{sd:5,dx:0,dy:0,sc:.75},scrib:{sd:60,dx:0,dy:0,sc:1}};
 const ids={t1:['t1-2','t1-3','t1-5','t1-7'],t:['t2-3','t2-5','t3-1','t3-3','t4-1','t4-4']},cache={},res={};
 for(const id of [...ids.t1,...ids.t]){const it=P.items.find(i=>i.id===id);await document.fonts.load('48px HarfNaskh',it.text);cache[id]=P.core(id);}
 for(const [g,list] of Object.entries(ids)){res[g]={};for(const [vn,v] of Object.entries(V)){let s=0;for(const id of list){const sm=cache[id].map(st=>{const a=gauss()*v.sd*.6,b2=gauss()*v.sd*.6;return st.map(p=>({x:500+(p.x-500)*v.sc+v.dx+a+gauss()*v.sd*.4,y:280+(p.y-280)*v.sc+v.dy+b2+gauss()*v.sd*.4,v:.4}));});s+=P.score(id,sm,0).acc;}res[g][vn]=Math.round(s/list.length);}}return res;});
console.log(JSON.stringify(r));
for(const g of ['t1','t']){const x=r[g];as(x.careful>=85,g+' careful tracing earns 3 stars, got '+x.careful);as(x.sloppy<x.careful-8,g+' sloppy below careful');as(x.off<80&&x.off<x.careful-15,g+" 25-unit offset is clearly worse than careful, got "+x.off);as(x.small<55,g+' undersized (75%) writing earns no star, got '+x.small);as(x.scrib<55,g+' scribble earns no star, got '+x.scrib);}
console.log(process.exitCode?'path-calibration: FAILED':'path-calibration ok');await b.close();srv.kill();})();
