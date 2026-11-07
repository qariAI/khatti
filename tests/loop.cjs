const path=require('path'),assert=require('assert'),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));let b;
try{b=await chromium.launch({headless:true});const base='http://127.0.0.1:'+(process.env.PORT||4173);
for(const [w,h] of [[390,844],[320,568],[800,360]]){const p=await(await b.newContext({viewport:{width:w,height:h}})).newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.evaluate(()=>{localStorage.clear();localStorage.setItem('harf.intros.auto.v1','false');});await p.reload();
 await(async()=>{if(!await p.locator('.studio-loop-card').count())await (await p.locator('#creative-studio').waitFor(),p).evaluate(()=>{const b=document.createElement('button');b.dataset.creative='more';document.querySelector('#creative-studio').append(b);b.click();b.remove();});if(await p.locator('#studio-intro .intro-skip').count())await p.locator('#studio-intro .intro-skip').first().click().catch(()=>{});await p.waitForTimeout(500);await p.locator('.studio-loop-card').click()})();await p.waitForSelector('#loop-frame');const f=p.frameLocator('#loop-frame');await f.locator('#board .tile.line').first().waitFor();
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+w);
 const fr=p.frames().find(x=>x!==p.mainFrame());await fr.evaluate(()=>KhattiLoop.solveForTest());await fr.waitForSelector('#board.solved');
 assert.match(await f.locator('#doneMsg').innerText(),/Alif/);
 // other Khatti features still reachable: Learn, Chapter 3, lessons
 assert.equal(await p.locator('#app nav:visible').count(),0,'no old bottom nav in Loop');await p.locator('.loop-back').click();await p.locator('.creative-hero').waitFor();
 await p.locator('.nb-loop-card').click();await p.waitForSelector('#loop-frame');
 assert.deepEqual(errors,[]);await p.context().close();}
console.log('loop-in-app ok');}finally{await b?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
