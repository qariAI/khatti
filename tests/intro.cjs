const {chromium}=require('playwright');const assert=require('assert');const path=require('path');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));const base='http://127.0.0.1:'+(process.env.PORT||4173);
const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__khattiIntroTest=1;});
await p.goto(base+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.waitForSelector('#khatti-intro');
for(let i=0;i<3;i++){await p.click('.ki-next');await p.waitForTimeout(150);}
assert.equal(await p.locator('#khatti-intro [data-ki-goal]').count(),3,'goal chips on last scene');
await p.click('[data-ki-goal][data-goal=dua]');await p.waitForSelector('#scribe-path',{state:'visible'});await p.waitForTimeout(400);
assert.equal(await p.locator('#khatti-intro').count(),0,'intro closes');
assert.match(await p.evaluate(()=>localStorage.getItem('khatti.goal.v1')),/dua/);
await p.reload();await p.waitForTimeout(800);assert.equal(await p.locator('#khatti-intro').count(),0,'only once');
await p.goto(base+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.waitForSelector('.creative-header');await p.click('.creative-mywork');await p.click('#my-work [data-khatti-intro]');await p.waitForSelector('#khatti-intro');await p.click('.ki-skip');await p.waitForTimeout(400);assert.equal(await p.locator('#khatti-intro').count(),0,'skip closes');
assert.deepEqual(errs,[]);console.log('intro ok');await b.close();server.kill();})().catch(e=>{console.error(e);process.exit(1)});
