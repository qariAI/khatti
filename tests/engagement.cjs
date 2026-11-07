const {chromium}=require('playwright');const assert=require('assert');const path=require('path');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));const base='http://127.0.0.1:'+(process.env.PORT||4173);
const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.goal.v1',JSON.stringify({done:1}))});
await p.goto(base+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.waitForSelector('.nb-canvas');
assert.match(await p.innerText('.nb-hero .btn'),/Start the Path/,'fresh CTA starts the Path');
assert(await p.locator('.nb-nudge').isHidden(),'no nudge before drawing');
const r=await p.locator('.nb-canvas').boundingBox();
await p.mouse.move(r.x+60,r.y+80);await p.mouse.down();for(let i=0;i<30;i++)await p.mouse.move(r.x+60+i*6,r.y+80+Math.sin(i/3)*30);await p.mouse.up();
await p.waitForSelector('.nb-nudge:not([hidden])',{timeout:3000});
assert.equal(await p.evaluate(()=>+getComputedStyle(document.querySelector('.nb-word')).opacity),0,'Allah gone once drawing');
await p.click('.nb-nudge button');await p.waitForSelector('#scribe-path',{state:'visible'});
const ev=JSON.parse(await p.evaluate(()=>window.__khattiEvents.dump())).counts;assert(ev.nudge_shown>=1&&ev.nudge_click>=1,'nudge tracked locally');
// continue CTA once the Path is started
await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('khatti_path_progress')||'null')||{version:1,items:{},lawha:{},unlocked:{}};const it=window.__khattiPath.items;const id=Array.isArray(it)?it[0].id:Object.keys(it)[0];s.items[id]={best:60,stars:1,attempts:1,seal:false,done:true,last:Date.now()};localStorage.setItem('khatti_path_progress',JSON.stringify(s));});
await p.reload();await p.waitForSelector('.nb-hero .btn');
assert.match(await p.innerText('.nb-hero .btn'),/Continue · /,'CTA continues the Path');
await p.click('.nb-hero [data-path-continue]');await p.waitForSelector('#scribe-practice',{state:'visible'});
assert.deepEqual(errs,[]);console.log('engagement ok');await b.close();server.kill();})().catch(e=>{console.error(e);process.exit(1)});
