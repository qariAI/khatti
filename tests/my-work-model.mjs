import assert from 'node:assert/strict';
import {cleanWorkSource,validWorkSource} from '../src/my-work-model.js';
const original={kind:'ink',name:'My drawing',caption:'',penWidth:12,fontCss:'large font',strokes:[{width:12,color:'#125454',points:[[1,2],[3,4]],pressures:[.2,.8]}]},source=cleanWorkSource(original);
assert(validWorkSource(source));assert(!Object.hasOwn(source,'fontCss'));source.strokes[0].points[0][0]=99;assert.equal(original.strokes[0].points[0][0],1);
assert(!validWorkSource({...source,strokes:[{points:[[Infinity,3]]}]}));assert(!validWorkSource({...source,strokes:[{points:[[1,3]],pressures:[4]}]}));assert(!validWorkSource({...source,strokes:[]}));assert(!validWorkSource({kind:'typeset',name:'<script>',caption:''}));assert(validWorkSource(cleanWorkSource({kind:'typeset',name:'نور',caption:'For you',fontCss:'large font'})));
console.log('PASS saved artwork snapshots isolate original ink, omit font payloads and reject invalid text/geometry/pressure');
