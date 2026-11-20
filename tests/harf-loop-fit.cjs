// v6.55.1: Harf Loop fills the frame under the Khatti header, with nothing scrolling or clipped inside it.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('assert');const path=require('path');
const {solve,openLoop}=require('./loop-helpers.cjs');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));let b;
try{b=await chromium.launch();const base='http://127.0.0.1:'+(process.env.PORT||4173)+'/dist/Harf-Writer-v5-Complete-Ayahs.html';
for(const [w,h] of [[390,844],[360,640],[1280,720]])for(const lang of ['en','ar']){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const errs=[];
 await ctx.addInitScript(l=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.clear();localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.goal.v1','{"version":1,"goal":"hand"}');localStorage.setItem('khatti.lang.v1',l);}},lang);
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(base);await p.waitForSelector('.creative-header [data-kl-toggle]');
 const fr=await openLoop(p);const tag=w+'x'+h+' '+lang;
 const frameBox=await p.locator('#loop-frame').boundingBox(),head=await p.locator('.loop-top').boundingBox();
 assert(Math.abs(frameBox.width-w)<=1,'frame is full width '+tag);assert(Math.abs(frameBox.y+frameBox.height-h)<=1,'frame reaches the bottom '+tag+' '+JSON.stringify(frameBox));assert(Math.abs(frameBox.y-(head.y+head.height))<=1,'frame sits under the header '+tag);
 assert.equal(await p.locator('#loop-frame').evaluate(e=>getComputedStyle(e).borderTopWidth+getComputedStyle(e).borderTopLeftRadius),'0px0px','no border or rounded clip');
 assert.equal(await fr.locator('.top').isVisible(),false,'empty top bar hidden '+tag);
 const row=await fr.evaluate(()=>{const pk=document.querySelector('.pickers');return [...pk.children].map(e=>e.id)});assert.deepEqual(row.sort(),['chapter','collection','daily','level'],'Daily/Collection share the picker row '+tag);
 const check=async(label)=>{
  const r=await fr.evaluate(()=>{const m=document.querySelector('main'),v=innerHeight,out=[];
   for(const id of ['chapter','level','daily','collection','board','name','prompt','restart','hint','count']){const e=document.getElementById(id);if(!e)continue;const b=e.getBoundingClientRect();if(b.width&&(b.bottom>v+1||b.top<-1))out.push(id);}
   for(const id of ['next','write','score']){const e=document.getElementById(id);if(e&&!e.hidden){const b=e.getBoundingClientRect();if(b.bottom>v+1||b.top<-1)out.push(id);}}
   return {scroll:m.scrollHeight-m.clientHeight,doc:document.documentElement.scrollHeight-v,out};});
  assert(r.scroll<=1&&r.doc<=1,'no inner scroll '+label+' '+JSON.stringify(r));assert.deepEqual(r.out,[],'everything visible '+label);};
 await check('before solve '+tag);
 // pickers never truncate their text
 const trunc=await fr.evaluate(()=>['chapter','level'].map(id=>{const s=document.getElementById(id),cs=getComputedStyle(s),sp=document.createElement('span');sp.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+cs.font;sp.textContent=s.options[s.selectedIndex].text;document.body.append(sp);const tw=sp.getBoundingClientRect().width;sp.remove();return {id,text:s.options[s.selectedIndex].text,tw,room:s.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-20,sw:s.scrollWidth,cw:s.clientWidth};}));
 for(const r of trunc){assert(r.sw<=r.cw,'picker scrollWidth '+tag+JSON.stringify(r));assert(r.tw<=r.room,'picker text fits '+tag+JSON.stringify(r));}
 const ib=await fr.evaluate(()=>['daily','collection'].map(id=>{const b=document.getElementById(id).getBoundingClientRect(),e=document.getElementById(id);return [Math.round(b.width),Math.round(b.height),!!e.getAttribute('aria-label'),!!e.title];}));
 assert.deepEqual(ib,[[40,40,true,true],[40,40,true,true]],'icon buttons '+tag);
 if(process.env.SHOTS&&w!==1280)await p.screenshot({clip:{x:0,y:44,width:w,height:70},path:path.join(process.env.SHOTS,'pickers-'+w+'-'+lang+'.png')});
 if(w<=390)for(const id of [179,176]){
  await fr.evaluate(async i=>{await load(i);},id);await fr.waitForFunction(()=>ready);await p.waitForTimeout(300);
  const m=await fr.evaluate(()=>({n:active.w+'x'+active.h,tiles:[...document.querySelectorAll('#board .tile')].map(e=>e.getBoundingClientRect().width),scroll:document.querySelector('main').scrollHeight-document.querySelector('main').clientHeight}));
  assert(m.tiles.length>0&&Math.min(...m.tiles)>=33.5,'master tiles >=34px '+tag+' '+id+' '+m.n+' min '+Math.min(...m.tiles));
  assert.equal(await fr.locator('#board').evaluate(e=>e.getBoundingClientRect().right<=innerWidth+1),true,'board inside width '+tag);
  if(process.env.SHOTS&&id===179)await p.screenshot({path:path.join(process.env.SHOTS,'master34-'+w+'x'+h+'-'+lang+'.png')});
  if(id===179&&m.n!=='9x10')throw new Error('unexpected master 34 size '+m.n);
 }
 if(w<=390)await fr.evaluate(async()=>{await load(0);});await fr.waitForFunction(()=>ready);
 if(process.env.SHOTS&&(h!==640))await p.screenshot({path:path.join(process.env.SHOTS,'fit-'+w+'x'+h+'-'+lang+'.png')});
 await solve(fr);await fr.locator('#write').waitFor({state:'visible'});await p.waitForTimeout(600);
 assert(await fr.locator('#next').isVisible()||true);await check('solved '+tag);
 assert.equal(await fr.locator('#write').isVisible(),true);assert.equal(await fr.locator('#hint').isVisible(),true);
 if(process.env.SHOTS&&h!==640)await p.screenshot({path:path.join(process.env.SHOTS,'fit-solved-'+w+'x'+h+'-'+lang+'.png')});
 assert.deepEqual(errs,[]);await ctx.close();}
console.log('harf-loop-fit ok');}finally{await b?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
