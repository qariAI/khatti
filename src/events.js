/* Local-only usage counters (khatti.events.v1). Nothing is transmitted: the app promises that nothing leaves the device.
   Read them with __khattiEvents.dump() or ask a tester to paste the output. */
const EV_KEY='khatti.events.v1';
function evRead(){try{const v=JSON.parse(localStorage.getItem(EV_KEY));if(v&&v.version===1&&v.counts)return v;}catch{}return{version:1,first:'',days:[],counts:{}};}
function evTrack(name){try{if(!/^[a-z_]{1,32}$/.test(name))return;const v=evRead(),d=new Date().toISOString().slice(0,10);if(!v.first)v.first=d;if(!v.days.includes(d)){v.days.push(d);if(v.days.length>60)v.days.shift();}v.counts[name]=(v.counts[name]||0)+1;localStorage.setItem(EV_KEY,JSON.stringify(v));}catch{}}
export function installEvents(){
 if(typeof document==='undefined'||window.__khattiEvents)return;
 window.addEventListener('khatti:track',e=>evTrack(String(e.detail||'')));
 evTrack('visit');
 window.__khattiEvents={dump:()=>JSON.stringify(evRead()),track:evTrack};
}
if(typeof document!=='undefined')installEvents();
