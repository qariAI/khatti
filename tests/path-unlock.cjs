// v6.52: while Tier 2 is locked, Continue and the result's Next steer to core letters below 80%.
const {chromium}=require('playwright');const assert=require('assert');const path=require('path');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));const base='http://127.0.0.1:'+(process.env.PORT||4173);
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const errs=[];
const seed=items=>ctx.addInitScript(it=>{if(sessionStorage.getItem('seeded'))return;sessionStorage.setItem('seeded','1');localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.goal.v1','{"version":1,"goal":"hand"}');localStorage.setItem('khatti_path_progress',JSON.stringify({version:1,items:it,unlocked:{}}));},items);
const mk=(best)=>({best,stars:best>=85?3:best>=70?2:best>=55?1:0,attempts:2,seal:false,done:best>=55,last:best});
// all 8 core letters done at 1-2 stars, Ra/Sin/Mim below 80
const items={'t1-1':mk(90),'t1-2':mk(88),'t1-3':mk(85),'t1-4':mk(65),'t1-5':mk(72),'t1-6':mk(84),'t1-7':mk(60),'t1-8':mk(86)};
await seed(items);const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(base+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.waitForSelector('.creative-header');
let n=await p.evaluate(()=>khattiNext());assert.equal(n.id,'t1-4','Continue goes to the first core letter below 80 (Ra), not an extra letter');
assert.match(await p.locator('[data-path-continue]').innerText(),/Ra/);
await p.evaluate(()=>window.dispatchEvent(new Event('khatti:open-path')));await p.waitForSelector('#scribe-path',{state:'visible'});
assert.match(await p.locator('#scribe-path .sp-sep').innerText(),/not needed to unlock/i);
assert.match(await p.locator('#scribe-path .sp-title p').innerText(),/first 8 letters/);
assert.match(await p.locator('.sp-tier[data-tier="2"] .sp-hint').innerText(),/first 8 letters/);
assert.equal(await p.locator('.sp-tier[data-tier="1"] .sp-tstat span').first().innerText(),'79% avg');
// result Next after Lam (t1-8, already 86) should go to a core gap, not Ta
await p.click('[data-sp-item="t1-8"]');await p.waitForSelector('#scribe-practice');
const r=await p.locator('#scribe-practice canvas.gh').boundingBox();await p.mouse.move(r.x+r.width*.5,r.y+r.height*.2);await p.mouse.down();await p.mouse.move(r.x+r.width*.5,r.y+r.height*.7,{steps:8});await p.mouse.up();
await p.click('[data-k="check"]');await p.waitForSelector('.sp-result:not([hidden])');
await p.locator('.sp-result button:has-text("Next")').click();await p.waitForTimeout(500);const head=await p.locator('#scribe-practice').innerText();assert.match(head,/\bRa\b/,'result Next opens Ra');assert.doesNotMatch(head.split('\n').slice(0,3).join(' '),/\bTa\b/);
// once Tier 2 is open, normal order resumes
await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('khatti_path_progress'));s.unlocked={2:true};localStorage.setItem('khatti_path_progress',JSON.stringify(s));});
await p.reload();await p.waitForSelector('.creative-header');n=await p.evaluate(()=>khattiNext());assert.equal(n.id,'t1-9','after unlock, Continue resumes normal order');
assert.deepEqual(errs,[]);console.log('path-unlock ok');await b.close();server.kill();})().catch(e=>{console.error(e);process.exit(1)});
