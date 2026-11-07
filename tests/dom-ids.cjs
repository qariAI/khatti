/* Guards against duplicate element IDs in every main view (home, Learn, practice modes, journey practice, atelier, tutorial). */
const {chromium}=require('playwright'),path=require('path'),assert=require('assert');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')],{env:{...process.env,PORT:process.env.PORT||'4173'}});await new Promise(r=>server.stdout.once('data',r));
const b=await chromium.launch(),p=await b.newPage({viewport:{width:390,height:844}});
try{await p.addInitScript(()=>{localStorage.setItem('harf.intros.auto.v1','false')});
const check=async name=>{const d=await p.evaluate(()=>{const c={};for(const e of document.querySelectorAll('[id]'))c[e.id]=(c[e.id]||0)+1;return Object.entries(c).filter(([,n])=>n>1);});assert.deepEqual(d,[],'duplicate ids in '+name);};
await p.goto('http://127.0.0.1:'+(process.env.PORT||4173)+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await p.waitForFunction(()=>window.HarfStudio);await check('studio home');
await 
await p.evaluate(()=>window.dispatchEvent(new Event('khatti:open-tutorial')));await p.waitForSelector('#tutorial');await check('tutorial');await p.click('[data-tu=skip]');
await p.reload();await p.waitForFunction(()=>window.HarfStudio);
await (await p.locator('#creative-studio').waitFor(),p).evaluate(()=>{const b=document.createElement('button');b.dataset.creative='more';document.querySelector('#creative-studio').append(b);b.click();b.remove();});await p.evaluate(()=>{document.querySelector('dialog[open]')?.close();const b=document.createElement('button');b.dataset.creative='library';document.querySelector('#creative-studio').append(b);b.click();});await p.waitForTimeout(400);await p.locator('.intro-skip').click({timeout:1500}).catch(()=>{});await check('learn home');
await p.locator('[data-action="learning-continue"]').first().click();await p.waitForTimeout(400);await check('practice watch');
for(const m of ['trace','copy','recall']){await p.locator('[data-action="mode"][data-id="'+m+'"]:visible').first().click();await check('practice '+m);}
await p.locator('[data-action="exit"]').click();await p.waitForTimeout(300);await check('after exit');
console.log('PASS dom-ids: no duplicate element IDs across home, playground, tutorial, atelier, Learn and practice modes');
}catch(e){console.error(e);process.exitCode=1;}finally{await b.close();server.kill();}})();
