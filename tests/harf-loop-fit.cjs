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
 if(process.env.SHOTS&&(h!==640))await p.screenshot({path:path.join(process.env.SHOTS,'fit-'+w+'x'+h+'-'+lang+'.png')});
 await solve(fr);await fr.locator('#write').waitFor({state:'visible'});await p.waitForTimeout(600);
 assert(await fr.locator('#next').isVisible()||true);await check('solved '+tag);
 assert.equal(await fr.locator('#write').isVisible(),true);assert.equal(await fr.locator('#hint').isVisible(),true);
 if(process.env.SHOTS&&h!==640)await p.screenshot({path:path.join(process.env.SHOTS,'fit-solved-'+w+'x'+h+'-'+lang+'.png')});
 assert.deepEqual(errs,[]);await ctx.close();}
console.log('harf-loop-fit ok');}finally{await b?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
