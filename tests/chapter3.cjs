const path=require('path'),assert=require('assert'),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));let b;
try{b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
const base='http://127.0.0.1:'+(process.env.PORT||4173);
for(const [w,h] of [[320,568],[390,844],[800,360]]){
 const c=await b.newContext({viewport:{width:w,height:h},hasTouch:false});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(base+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.waitForFunction(()=>window.HarfChapter3);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('harf.intros.auto.v1','false');});await p.reload();await p.waitForFunction(()=>window.HarfChapter3);
 const noScroll=async()=>assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal scroll at '+w);
 await (await p.locator('#creative-studio').waitFor(),p).evaluate(()=>{const b=document.createElement('button');b.dataset.creative='more';document.querySelector('#creative-studio').append(b);b.click();b.remove();});await p.evaluate(()=>{document.querySelector('dialog[open]')?.close();const b=document.createElement('button');b.dataset.creative='library';document.querySelector('#creative-studio').append(b);b.click();});if(await p.locator('#studio-intro[open]').count())await p.locator('.intro-skip').click();await p.locator('[data-action="chapter3"]').click();await p.waitForSelector('[data-ch3-view="hub"]');assert.match(await p.locator('h1').first().innerText(),/proportioned pen/);await noScroll();
 assert(await p.locator('.ch3-draft').count()>=1);assert.equal(await p.locator('.ch3-chip',{hasText:'Not started'}).count(),1);
 // rewards locked
 assert.equal(await p.locator('.ch3-rewards .ch3-chip',{hasText:'Locked'}).count(),3);
 // story
 await p.locator('[data-ch="story"]').click();assert(await p.locator('.ch3-anim').count()===1);assert.match(await p.locator('.ch3-draft').innerText(),/Source to add/);await noScroll();
 await p.locator('[data-ch="story-next"]').click();await p.locator('[data-ch="story-next"]').click();await p.locator('[data-ch="story-finish"]').click();await p.waitForSelector('[data-ch3-view="hub"]');
 assert.equal((await p.evaluate(()=>HarfChapter3.snapshot())).state.explored,true);assert.equal(await p.locator('.ch3-chip',{hasText:'Explored'}).count()>=1,true);
 // exercise round-trip returns to chapter
 await p.locator('[data-ch="lesson"][data-id="nuqta"]').click();await p.waitForSelector('[data-action="exit"]');await p.locator('[data-action="exit"]').first().click();await p.waitForSelector('[data-ch3-view="hub"]');
 // compose: locked items disabled
 await p.locator('[data-ch="compose"]').first().click();await p.waitForSelector('#ch3-canvas');await noScroll();
 assert.equal(await p.locator('[data-ch="paper"][data-value="warm"]').isDisabled(),true);assert.equal(await p.locator('[data-ch="border"]').isDisabled(),true);assert.equal(await p.locator('[data-ch="save"]').isDisabled(),true);
 await p.locator('#ch3-canvas').scrollIntoViewIfNeeded();const r=await p.locator('#ch3-canvas').boundingBox();assert(r.y>=-2&&r.y+r.height<=h+1,'canvas fits viewport '+w+'x'+h+' '+JSON.stringify(r));
 for(let i=0;i<2;i++){await p.mouse.move(r.x+r.width*.3+i*30,r.y+r.height*.3);await p.mouse.down();await p.mouse.move(r.x+r.width*.3+i*30,r.y+r.height*.7,{steps:8});await p.mouse.up();}
 assert.equal((await p.evaluate(()=>HarfChapter3.snapshot())).draftStrokes,2);
 await p.locator('[data-ch="undo"]').click();assert.equal((await p.evaluate(()=>HarfChapter3.snapshot())).draftStrokes,1);await p.locator('[data-ch="redo"]').click();assert.equal((await p.evaluate(()=>HarfChapter3.snapshot())).draftStrokes,2);
 await p.locator('[data-ch="save"]').click();await p.waitForSelector('[data-ch3-view="exhibition"]');assert.equal(await p.locator('.ch3-piece').count(),1);
 const snap=await p.evaluate(()=>HarfChapter3.snapshot());assert.equal(snap.state.pieces.length,1);assert.equal(snap.state.pieces[0].strokes.length,2);
 // persisted + valid
 const raw=await p.evaluate(()=>localStorage.getItem('harf.chapter3.v1'));assert(JSON.parse(raw).pieces.length===1);
 // download works
 const dl=p.waitForEvent('download');await p.locator('[data-ch="download"]').click();assert.match((await dl).suggestedFilename(),/^Khatti-Chapter3-.*\.png$/);
 // remove needs confirmation
 await p.locator('[data-ch="remove"]').click();assert.equal(await p.locator('.ch3-piece').count(),1);await p.locator('[data-ch="cancel-remove"]').click();assert.equal(await p.locator('.ch3-piece').count(),1);
 await p.locator('[data-ch="remove"]').click();await p.locator('[data-ch="confirm-remove"]').click();assert.equal(await p.locator('.ch3-piece').count(),0);
 // reload keeps explored; backup includes key
 await p.reload();await p.waitForFunction(()=>window.HarfChapter3);assert.equal((await p.evaluate(()=>HarfChapter3.snapshot())).state.explored,true);
 // corrupt data is left untouched
 await p.evaluate(()=>localStorage.setItem('harf.chapter3.v1','{bad'));await p.reload();await p.waitForFunction(()=>window.HarfChapter3);assert.equal((await p.evaluate(()=>HarfChapter3.snapshot())).readable,false);assert.equal(await p.evaluate(()=>localStorage.getItem('harf.chapter3.v1')),'{bad');
 assert.deepEqual(errors,[]);await c.close();}
console.log('chapter3 browser ok');
}finally{await b?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
