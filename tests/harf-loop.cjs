// v6.55: Harf Loop replaces the old Loop. Khatti mode, no Khatti translation inside the game, "Write it" -> Path practice for the letter, Back -> Loop.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('assert');const path=require('path');
const {solve,openLoop}=require('./loop-helpers.cjs');
(async()=>{const server=require('child_process').spawn(process.execPath,[path.join(__dirname,'../scripts/serve.mjs')]);await new Promise(r=>server.stdout.once('data',r));let b;
try{b=await chromium.launch();const base='http://127.0.0.1:'+(process.env.PORT||4173)+'/dist/Harf-Writer-v5-Complete-Ayahs.html';
for(const lang of ['en','ar']){
 const ctx=await b.newContext({viewport:{width:390,height:844}});const errs=[];
 await ctx.addInitScript(l=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.clear();localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.goal.v1','{"version":1,"goal":"hand"}');localStorage.setItem('khatti.lang.v1',l);}},lang);
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto(base);await p.waitForSelector('.creative-header [data-kl-toggle]');
 assert.equal(await p.evaluate(()=>document.documentElement.lang),lang);
 let fr=await openLoop(p);
 const kmode=await fr.evaluate(()=>document.documentElement.getAttribute('data-khatti-lang'));assert.equal(kmode,'en','build sets data-khatti-lang="en"');
 assert.equal(await fr.locator('.brand').isVisible(),false,'game header hidden ('+lang+')');
 assert.equal(await fr.locator('#language').isVisible(),false,'game language picker hidden ('+lang+')');
 assert.equal(await fr.evaluate(()=>document.documentElement.lang),lang,'game follows Khatti language ('+lang+')');
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
 // Khatti's lang.js must leave the game alone: its document is not watched, restyled or mirrored
 const touched=await fr.evaluate(()=>({watched:!!document.__kl,styles:[...document.querySelectorAll('style')].some(s=>/letter-spacing:normal!important/.test(s.textContent)&&/html\[lang=ar\]/.test(s.textContent)),rtl:document.documentElement.dir}));
 assert.equal(touched.watched,false,'lang.js did not attach to the game');assert.equal(touched.styles,false,'lang.js injected no CSS into the game');
 if(lang==='ar'){assert.equal(touched.rtl,'rtl','game sets its own RTL');assert(/[؀-ۿ]/.test(await fr.locator('#caption').innerText().catch(()=>'')||await fr.locator('body').innerText()),'game shows its own Arabic');}
 else assert.equal(touched.rtl,'ltr');
 const before=await fr.evaluate(()=>document.body.innerHTML);await p.waitForTimeout(400);
 await fr.evaluate(()=>{const s=document.createElement('span');s.id='probe';s.textContent='Hint';document.body.append(s);});await p.waitForTimeout(200);
 assert.equal(await fr.locator('#probe').innerText(),'Hint','lang.js does not translate text added to the game');
 await fr.evaluate(()=>document.getElementById('probe').remove());
 if(lang==='en'){
  await solve(fr);await fr.locator('#write').waitFor({state:'visible'});
  await fr.locator('#write').click();
  await p.waitForSelector('#scribe-practice');
  assert.equal(await p.locator('#loop-frame').count(),0,'Loop is closed');assert.equal(await p.locator('.loop-page').count(),0);
  assert.equal(await p.locator('#scribe-practice .sp-phead h2').innerText(),'Alif');
  assert.equal(await p.locator('#scribe-practice').evaluate(e=>e.getAttribute('aria-label')),'Practice Alif');
  await p.waitForTimeout(300);await p.screenshot({path:process.env.SHOTS?path.join(process.env.SHOTS,'practice-390.png'):undefined});
  // a message with a bad letter, bad origin shape or wrong type does nothing
  await p.locator('.sp-x').first().click();await p.waitForSelector('#loop-frame');
  assert.equal(await p.locator('#scribe-practice').count(),0,'practice closed');
  fr=await(await p.waitForSelector('#loop-frame')).contentFrame();await fr.waitForSelector('#board .tile');
  await p.evaluate(()=>{const w=document.getElementById('loop-frame').contentWindow;for(const m of [{type:'khatti-loop-write',letter:'A'},{type:'khatti-loop-write',letter:'اب'},{type:'other',letter:'ا'},{type:'khatti-loop-write'}])w.parent.postMessage(m,'*');});
  await p.waitForTimeout(500);assert.equal(await p.locator('#scribe-practice').count(),0,'invalid messages ignored');
  assert.equal(await p.locator('#loop-frame').count(),1,'still in Loop');
 }
 if(process.env.SHOTS)await p.screenshot({path:path.join(process.env.SHOTS,'loop-'+lang+'-390.png')});
 assert.deepEqual(errs,[]);await ctx.close();}
console.log('harf-loop ok');}finally{await b?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
