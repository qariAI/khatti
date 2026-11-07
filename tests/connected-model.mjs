import assert from 'node:assert/strict';
import fs from 'node:fs';
import {makeConnectedForms,connectedToLocal,connectedToSource,connectedPlacement,connectedViewBox,freshConnected,validConnected} from '../src/connected-model.js';
const forms=makeConnectedForms(JSON.parse(fs.readFileSync(new URL('../data/lessons.json',import.meta.url))));
const writing=forms.map(f=>f.model.map((s,i)=>({brush:f.id==='ba'&&i===1?'dot':'qalam',points:s.points.map(p=>connectedToLocal(f,p))})));
for(const f of forms)for(const s of f.model)for(const p of s.points){const q=connectedToSource(f,connectedToLocal(f,p));assert(Math.hypot(q[0]-p[0],q[1]-p[1])<1e-8);}
const zero=connectedPlacement(forms,writing,0),loose=connectedPlacement(forms,writing,12);assert.equal(zero.bridges.length,0);assert.equal(loose.bridges.length,2);assert.equal(zero.strokes.length,5);assert(Math.abs(loose.strokes[0].points[0][0]-zero.strokes[0].points[0][0]-12)<1e-8);assert(Math.abs(loose.strokes.at(-1).points[0][0]-zero.strokes.at(-1).points[0][0]+12)<1e-8);assert.equal(connectedPlacement(forms,[writing[0],[],writing[2]],12).bridges.length,0);
const far=structuredClone(writing);far[1].forEach(s=>s.points=s.points.map(([x,y])=>[x+180,y+180]));assert.equal(connectedPlacement(forms,far,0).bridges.length,0);
const vb=connectedViewBox(loose.strokes);for(const s of loose.strokes)for(const [x,y] of s.points)assert(x>=vb[0]&&x<=vb[0]+vb[2]&&y>=vb[1]&&y<=vb[1]+vb[3]);const state=freshConnected();state.forms=writing;assert(validConnected(state));state.spacing=30;assert(!validConnected(state));state.spacing=0;state.forms[0][0].points[0][0]=NaN;assert(!validConnected(state));console.log('PASS connected form transforms, RTL placement, endpoint-only bridges, spacing, export bounds and storage validation');
