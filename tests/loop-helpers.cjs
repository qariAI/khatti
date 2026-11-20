/* Shared helpers for the Harf Loop tests (the game exposes no test hook, so we solve by following its own hint). */
exports.solve=async function solve(frame){
 for(let i=0;i<80;i++){
  if(await frame.locator('#board.solved').count())return;
  await frame.locator('#hint').click();
  const t=frame.locator('#board .hint').first();
  await t.waitFor({timeout:3000});await t.click();
 }
 await frame.waitForSelector('#board.solved',{timeout:3000});
};
exports.openLoop=async function openLoop(p){
 await p.waitForSelector('.nb-loop-card');await p.click('.nb-loop-card');await p.waitForSelector('#loop-frame');
 const fr=await(await p.waitForSelector('#loop-frame')).contentFrame();await fr.waitForSelector('#board .tile');return fr;
};
