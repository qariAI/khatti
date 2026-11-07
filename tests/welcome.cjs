const {chromium}=require('playwright');const {spawn}=require('child_process');
const PORT=process.env.PORT||5931;
(async()=>{const srv=spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT},stdio:'ignore'});await new Promise(r=>setTimeout(r,1500));
const b=await chromium.launch();const as=(c,m)=>{if(!c){console.log('FAIL',m);process.exitCode=1;}};
const url='http://localhost:'+PORT+'/dist/Harf-Writer-v5-Complete-Ayahs.html';
async function open(seed){const ctx=await b.newContext({viewport:{width:390,height:800}});const pg=await ctx.newPage();await pg.addInitScript(s=>{if(!sessionStorage.__seeded){localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.tutorial.v1',JSON.stringify({version:1,seen:true,completed:true,step:0,badge:'',runs:1}));if(s)for(const k in s)localStorage.setItem(k,s[k]);sessionStorage.__seeded=1;}},seed);await pg.goto(url);await pg.waitForTimeout(800);return pg;}
/* first run: goal card, three chips, hero still present */
let pg=await open(null);
as(await pg.locator('.wl-card:not(.back) [data-goal]').count()===3,'goal question on first run');
as(await pg.locator('.nb-hero').count()===1&&await pg.locator('.nb-canvas').count()===1,'hero unaffected');
as(await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow');
await pg.click('[data-goal=ayah]');await pg.waitForSelector('#scribe-path:not([hidden])');
as(await pg.evaluate(()=>JSON.parse(localStorage.getItem('khatti.goal.v1')).goal==='ayah'),'goal saved');
as(await pg.locator('.wl-card').count()===0,'card removed');
await pg.reload();await pg.waitForTimeout(800);as(await pg.locator('.wl-card').count()===0,'goal not asked again');
/* returner after 20 days */
const old=new Date(Date.now()-20*864e5).toISOString().slice(0,10);
pg=await open({'khatti.goal.v1':JSON.stringify({version:1,goal:'hand'}),'khatti.events.v1':JSON.stringify({version:1,first:old,days:[old],counts:{visit:1}})});
as(await pg.locator('.wl-card.back').count()===1,'welcome-back after 20 days');
as((await pg.textContent('.wl-card.back')).includes('20 days'),'shows days away');
await pg.click('.wl-card.back [data-path]');await pg.waitForSelector('#scribe-path:not([hidden])');
/* recent user: nothing */
const yd=new Date(Date.now()-864e5).toISOString().slice(0,10);
pg=await open({'khatti.goal.v1':JSON.stringify({version:1,goal:'hand'}),'khatti.events.v1':JSON.stringify({version:1,first:yd,days:[yd],counts:{visit:1}})});
as(await pg.locator('.wl-card').count()===0,'no card for a recent user');
/* QariAI link in More */
await pg.click('[aria-label*="More" i], .creative-more button >> nth=-1').catch(()=>{});
console.log(process.exitCode?'welcome: FAILED':'welcome ok');await b.close();srv.kill();})().catch(e=>{console.log('ERR',e.message);process.exit(1);});
