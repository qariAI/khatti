/* First-run goal question + welcome-back card on Home. Local only (khatti.goal.v1); never blocks the hero. */
const WL_KEY='khatti.goal.v1',WL_GOALS={hand:'The letters',dua:'Short duas',ayah:'Ayahs'};
function wlRead(){try{const v=JSON.parse(localStorage.getItem(WL_KEY));if(v&&v.version===1)return v;}catch{}return{version:1,goal:''};}
function wlAwayDays(){try{const v=JSON.parse(localStorage.getItem('khatti.events.v1')),d=v&&v.days||[];if(d.length<2)return 0;return Math.round((Date.parse(d[d.length-1])-Date.parse(d[d.length-2]))/864e5);}catch{return 0;}}
let wlHidden=false;
export function welcomeMarkup(){
 if(wlHidden)return '';
 const g=wlRead().goal,away=wlAwayDays();
 if(!g)return '<section class="wl-card" aria-label="Choose your goal"><h2>What do you want to write?</h2><p>Every goal starts on The Scribe’s Path. Tap one to see where you’re heading.</p><div class="wl-chips">'
  +'<button type="button" data-goal="hand" data-path data-sp-goto="1">'+WL_GOALS.hand+'</button><button type="button" data-goal="dua" data-path data-sp-goto="2">'+WL_GOALS.dua+'</button><button type="button" data-goal="ayah" data-path data-sp-goto="4">'+WL_GOALS.ayah+'</button></div><button type="button" class="wl-skip" data-wl-dismiss>Not now</button></section>';
 if(away>=7)return '<section class="wl-card back" aria-label="Welcome back"><h2>Welcome back</h2><p>It’s been '+away+' days. Pick up where you left off on The Scribe’s Path.</p><div class="wl-chips">'+(()=>{const n=window.khattiNext&&window.khattiNext();return n&&n.id?'<button type="button" data-wl-dismiss data-path-continue="'+n.id+'">Continue · '+n.name+'</button>':'';})()+'<button type="button" data-wl-dismiss data-path>Open the Path</button></div></section>';
 return '';
}
export function installWelcome(){
 if(typeof document==='undefined'||window.__khattiWelcome)return;window.__khattiWelcome=1;
 document.addEventListener('click',e=>{const b=e.target.closest('[data-goal],[data-wl-dismiss]');if(!b)return;const card=b.closest('.wl-card');
  if(b.dataset.goal){try{localStorage.setItem(WL_KEY,JSON.stringify({version:1,goal:b.dataset.goal}));}catch{}window.dispatchEvent(new CustomEvent('khatti:track',{detail:'goal_'+b.dataset.goal}));}
  else window.dispatchEvent(new CustomEvent('khatti:track',{detail:'welcome_back'}));
  wlHidden=true;if(card)setTimeout(()=>card.remove(),0);});
}
if(typeof document!=='undefined')installWelcome();
