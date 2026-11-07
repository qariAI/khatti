import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';
const folder=mkdtempSync(join(tmpdir(),'harf-stamp-'));try{
 cpSync(new URL('../dist/pwa/',import.meta.url),folder,{recursive:true});
 const run=()=>execFileSync(process.execPath,[join(folder,'stamp.js')],{encoding:'utf8'}).trim(),worker=()=>readFileSync(join(folder,'sw.js'),'utf8');
 const a=run(),original=worker();assert.equal(run(),a);assert.equal(worker(),original,'unchanged assets produce identical worker bytes');
 const manifest=JSON.parse(readFileSync(join(folder,'manifest.webmanifest')));assert.equal(manifest.icons.length,4);for(const size of [192,512])for(const purpose of ['any','maskable'])assert(manifest.icons.some(i=>i.sizes===`${size}x${size}`&&i.purpose===purpose));
 const files=['index.html','pwa.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon-180.png'];
 for(const file of files){const bytes=readFileSync(join(folder,file)),before=worker();writeFileSync(join(folder,file),Buffer.concat([bytes,Buffer.from('\n')]));run();assert.notEqual(worker(),before,file+' changes must alter worker bytes/cache version');writeFileSync(join(folder,file),bytes);run();assert.equal(worker(),original,'restoring original asset returns original stamp');}
 for(const [file,size]of [['icons/icon-192.png',192],['icons/icon-512.png',512],['icons/apple-touch-icon-180.png',180]]){const b=readFileSync(join(folder,file));assert.equal(b.readUInt32BE(16),size);assert.equal(b.readUInt32BE(20),size);}
 assert(readFileSync(join(folder,'index.html'),'utf8').includes('href="./icons/apple-touch-icon-180.png"'));
 const changed=worker().replace("self.addEventListener('install'","/* policy change */\nself.addEventListener('install'");writeFileSync(join(folder,'sw.js'),changed);run();assert.notEqual(worker().match(/CACHE=FAMILY\+'([a-f0-9]+)'/)[1],original.match(/CACHE=FAMILY\+'([a-f0-9]+)'/)[1],'worker logic changes also stamp differently');
 const corrupt='invalid worker marker';writeFileSync(join(folder,'sw.js'),corrupt);assert.notEqual(spawnSync(process.execPath,[join(folder,'stamp.js')]).status,0);assert.equal(worker(),corrupt,'failed stamping does not rewrite worker');
 writeFileSync(join(folder,'sw.js'),original);rmSync(join(folder,'pwa.js'));assert.notEqual(spawnSync(process.execPath,[join(folder,'stamp.js')]).status,0);assert.equal(worker(),original,'missing assets fail before writing');
 console.log('PASS deterministic release stamping, every runtime asset and worker-logic mutation, fail-closed errors, four icon purposes and PNG dimensions');
}finally{rmSync(folder,{recursive:true,force:true});}
