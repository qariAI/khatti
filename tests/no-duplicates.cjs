/* Guards against duplicate visible buttons/headings/descriptions on the main screens (and duplicate IDs). */
const {chromium}=require('playwright');const {spawn}=require('child_process');const PORT=process.env.PORT||6023;
const scan=()=>{const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};
 const out=[],ids={};document.querySelectorAll('[id]').forEach(e=>{ids[e.id]=(ids[e.id]||0)+1;});for(const k in ids)if(ids[k]>1)out.push('DUP ID '+k);
 const top=[...document.querySelectorAll('#tutorial,#scribe-practice,#scribe-path:not([hidden]),#atelier,dialog[open],#creative-studio')].filter(vis)[0]||document.body;
 const L={};top.querySelectorAll('button,a,[role=button],h1,h2,h3').forEach(e=>{if(!vis(e))return;const t=(e.getAttribute('aria-label')||e.textContent||'').replace(/\s+/g,' ').trim();if(!t||t.length>60)return;const k=e.tagName[0]+':'+t;L[k]=(L[k]||0)+1;});for(const k in L)if(L[k]>1)out.push('DUP LABEL '+k);
 const P={};top.querySelectorAll('p,small,h1,h2,h3,strong').forEach(e=>{if(!vis(e))return;const t=e.textContent.replace(/\s+/g,' ').trim();if(t.length<25)return;P[t]=(P[t]||0)+1;});for(const k in P)if(P[k]>1)out.push('DUP TEXT '+k.slice(0,50));return out;};
(async()=>{const srv=spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT},stdio:'ignore'});await new Promise(r=>setTimeout(r,1500));
const b=await chromium.launch();let bad=0;
for(const [n,w,h] of [['desk',1440,900],['phone',390,800]]){const pg=await b.newPage({viewport:{width:w,height:h}});
await pg.addInitScript(()=>{localStorage.setItem('harf.intros.auto.v1','false');localStorage.setItem('khatti.goal.v1',JSON.stringify({version:1,goal:'hand'}));localStorage.setItem('khatti.tutorial.v1',JSON.stringify({version:1,seen:true,completed:true,step:0,badge:'',runs:1}));});
await pg.goto('http://localhost:'+PORT+'/dist/Harf-Writer-v5-Complete-Ayahs.html');await pg.waitForTimeout(900);
const go=async(sel)=>{await pg.evaluate(s=>document.querySelector(s)?.click(),sel);await pg.waitForTimeout(500);for(const s of await pg.$$('.intro-skip'))await s.click().catch(()=>{});};
const rep=async(name)=>{const r=await pg.evaluate(scan);if(r.length){bad++;console.log('FAIL',n,name,r);}};
await rep('home');await pg.evaluate(()=>window.dispatchEvent(new CustomEvent('harf:creative-mode',{detail:'quest'})));await rep('letters');await pg.evaluate(()=>window.dispatchEvent(new CustomEvent('harf:creative-mode',{detail:'play'})));await rep('playground');
await pg.evaluate(()=>window.dispatchEvent(new Event('khatti:open-tutorial')));await pg.waitForTimeout(400);await rep('tutorial');await pg.click('[data-tu=skip]').catch(()=>{});
await pg.evaluate(()=>window.dispatchEvent(new Event('khatti:open-path')));await pg.waitForTimeout(400);await rep('path');await pg.close();}
console.log(bad?'no-duplicates: FAILED':'no-duplicates ok');if(bad)process.exitCode=1;await b.close();srv.kill();})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
