const {chromium}=require('playwright');const {spawn}=require('child_process');
const PORT=process.env.PORT||5881;
(async()=>{const srv=spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT},stdio:'ignore'});await new Promise(r=>setTimeout(r,1500));
const b=await chromium.launch(),pg=await b.newPage({viewport:{width:390,height:800},hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.addInitScript(()=>{try{localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.tutorial.v1',JSON.stringify({version:1,seen:true,completed:true,step:0,badge:'',runs:1}));}catch{}});
const as=(c,m)=>{if(!c){console.log('FAIL',m);process.exitCode=1;}};
await pg.goto('http://localhost:'+PORT+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await pg.waitForTimeout(800);
/* toggle on Home opens the Path */
await pg.waitForSelector('.creative-hero .btn[data-path]');await pg.click('.creative-hero .btn[data-path]');await pg.waitForSelector('#scribe-path:not([hidden])');
as(await pg.locator('.sp-tier').count()===4,'four tiers');
as(await pg.locator('.sp-tier[data-tier="1"] .sp-quote:not([disabled])').count()===28,'tier 1 open with all 28 letters');
as(await pg.locator('.sp-tier.locked').count()===3,'tiers 2-4 locked by default');
as(await pg.locator('.sp-tier[data-tier="2"] .sp-quote[disabled]').count()===8,'tier 2 cards disabled');
as(await pg.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'no horizontal overflow at 390px');
/* scoring: tracing the model scores high, blank 0, a scribble low */
const sc=await pg.evaluate(async()=>{await document.fonts.load('48px HarfNaskh','ا');const P=window.__khattiPath,o={};
 for(const id of ['t1-1','t1-3','t2-3','t3-1','t4-4']){await document.fonts.load('48px HarfNaskh',P.items.find(i=>i.id===id).text);o[id]=P.score(id,P.dots(id),0).acc;}
 o.blank=P.score('t2-3',[],0).acc;o.scribble=P.score('t2-3',[[{x:100,y:100,v:.4},{x:900,y:120,v:.4},{x:120,y:480,v:.4},{x:880,y:500,v:.4}]],0).acc;
 o.alifTilt=P.score('t1-1',[[{x:300,y:80},{x:700,y:480}].flatMap(p=>[p])],0).acc;o.alifVert=P.score('t1-1',[[{x:500,y:60},{x:500,y:500}]],0).acc;return o;});
console.log('scores',JSON.stringify(sc));
for(const k of ['t1-1','t1-3','t2-3','t3-1','t4-4'])as(sc[k]>=90,k+' perfect tracing >=90 got '+sc[k]);
as(sc.blank===0,'blank is 0');as(sc.scribble<30,'scribble low got '+sc.scribble);as(sc.alifVert>sc.alifTilt,'vertical alif beats tilted');
/* practise a Tier-1 letter with injected perfect ink, check result, stars, seal */
await pg.click('.sp-tier[data-tier="1"] .sp-quote');await pg.waitForSelector('#scribe-practice');
await pg.evaluate(()=>{const P=window.__khattiPath;P.practice.strokes=P.dots(P.practice.item.id).map(s=>s);});
as((await pg.textContent('.sp-att')).includes('Attempt 1'),'attempt 1 label');
await pg.click('[data-k=check]');await pg.waitForSelector('.sp-result:not([hidden])');
as(parseInt(await pg.textContent('.sp-pct'))>=90,'result shows accuracy');
let st=await pg.evaluate(()=>window.__khattiPath.state.items['t1-1']);as(st&&st.stars===3&&st.done&&st.attempts===1,'stars saved '+JSON.stringify(st));
as(await pg.evaluate(()=>!!localStorage.getItem('khatti_path_progress')),'khatti_path_progress persisted');
await pg.click('.sp-result [data-k=close]');await pg.waitForTimeout(100);
as(await pg.locator('.sp-node.done .sp-seal').count()>=1,'seal stamped on map');
/* unlock: finish all of tier 1 at >=80 average */
await pg.evaluate(async()=>{const P=window.__khattiPath;for(const it of P.tiers[0].items){if(it.id==='t1-2')continue;await document.fonts.load('48px HarfNaskh',it.text);const r=P.score(it.id,P.dots(it.id),0);P.state.items[it.id]={best:r.acc,stars:3,attempts:1,seal:false,done:true,last:r.acc};}});
/* complete one real check through the UI to trigger unlock logic */
await pg.click('.sp-tier[data-tier="1"] .sp-quote >> nth=1');await pg.waitForSelector('#scribe-practice');
await pg.evaluate(()=>{const P=window.__khattiPath;P.practice.strokes=P.dots(P.practice.item.id);});await pg.click('[data-k=check]');await pg.waitForSelector('.sp-result:not([hidden])');
as((await pg.textContent('.sp-result')).includes('is open'),'unlock message shown');
await pg.click('.sp-result [data-k=close]');await pg.waitForTimeout(100);
as(await pg.locator('.sp-tier.locked').count()===2,'tier 2 unlocked, 3-4 still locked');
/* guide fade: attempts drive opacity (tier 2) */
const fade=await pg.evaluate(async()=>{const P=window.__khattiPath,id='t2-1',o=[];for(const a of [0,1,2,3,4,6]){P.state.items[id]={best:0,stars:0,attempts:a,seal:false,done:false,last:0};P.refresh();document.querySelector('[data-sp-item="'+id+'"]').click();await new Promise(r=>setTimeout(r,250));o.push(document.querySelector('.sp-att').textContent);document.querySelector('#scribe-practice [data-k=close]').click();}return o;});
console.log('fade',JSON.stringify(fade));
as(fade[0].includes('100%')&&fade[1].includes('100%')&&fade[2].includes('50%')&&fade[3].includes('50%')&&fade[4].includes('0%')&&!fade[4].includes('50%')&&fade[5].includes('Guide 0%'),'guide 100/100/50/50/0/0');
/* memory seal on attempt 5+ without peeking, +XP */
const xp0=await pg.evaluate(()=>(JSON.parse(localStorage.getItem('harf.creative.v1')||'{}').xp)||0);
await pg.evaluate(()=>{window.__khattiPath.state.items['t2-1']={best:0,stars:0,attempts:4,seal:false,done:false,last:0};window.__khattiPath.refresh();});
await pg.click('[data-sp-item="t2-1"]');await pg.waitForSelector('#scribe-practice');await pg.waitForTimeout(150);
await pg.evaluate(()=>{const P=window.__khattiPath;P.practice.strokes=P.dots('t2-1');});await pg.click('[data-k=check]');await pg.waitForSelector('.sp-result:not([hidden])');
as((await pg.textContent('.sp-result')).includes('Memory Seal'),'memory seal awarded');
const xp1=await pg.evaluate(()=>(JSON.parse(localStorage.getItem('harf.creative.v1')||'{}').xp)||0);as(xp1-xp0>=40,'bonus XP got '+(xp1-xp0));
as(await pg.evaluate(()=>window.__khattiPath.state.items['t2-1'].seal===true),'seal saved');
await pg.click('.sp-result [data-k=close]');
/* Claim Lawha: unlock tier 4, high score */
await pg.evaluate(()=>{const P=window.__khattiPath;P.state.unlocked[2]=P.state.unlocked[3]=P.state.unlocked[4]=true;P.refresh();});
await pg.click('[data-sp-item="t4-1"]');await pg.waitForSelector('#scribe-practice');await pg.waitForTimeout(150);
await pg.evaluate(()=>{const P=window.__khattiPath;P.practice.strokes=P.dots('t4-1');});await pg.click('[data-k=check]');await pg.waitForSelector('.sp-result:not([hidden])');
as(await pg.locator('[data-k=lawha]').count()===1,'Claim Lawha offered at high precision');
await pg.click('[data-k=lawha]');await pg.waitForSelector('#scribe-plate canvas');
as(await pg.locator('#scribe-plate [data-th]').count()===3,'3 texture themes');
await pg.click('#scribe-plate [data-th=dark]');await pg.click('#scribe-plate [data-ink=gold]');
const dl=pg.waitForEvent('download');await pg.click('#scribe-plate [data-k=save]');const d=await dl;as(/khatti-lawha/.test(d.suggestedFilename()),'PNG export');
const law=await pg.evaluate(()=>window.__khattiPath.state.lawha['t4-1']);as(law&&law.theme==='dark'&&law.ink==='gold','plate settings persisted');
/* backup validator accepts the key */
as(await pg.evaluate(()=>{try{const s=JSON.parse(localStorage.getItem('khatti_path_progress'));return s.version===1;}catch{return false;}}),'state parses');
const ev=await pg.evaluate(()=>JSON.parse(__khattiEvents.dump()));as(ev.counts.path_open>=1&&ev.counts.path_attempt>=3&&ev.counts.lawha_claimed>=1&&ev.counts.lawha_saved>=1&&ev.counts.visit>=1,'local event counts '+JSON.stringify(ev.counts));
as(await pg.locator('#scribe-plate [data-k=share]').count()===1,'share button on plate');
as(errs.length===0,'page errors: '+errs.join('|'));
console.log(process.exitCode?'path: FAILED':'path ok');await b.close();srv.kill();})().catch(e=>{console.log('ERR',e.message);process.exit(1);});
