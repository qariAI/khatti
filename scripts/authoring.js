// Offline authoring tool only. Never imported by src/ui.js.
const NS='http://www.w3.org/2000/svg';
const L=(id,title,stage,goal,strokes,opts={})=>({id,version:1,script:'naskh',title:{en:title},stage,goal:{en:goal},review:{status:'draft',reviewerId:null},pen:{width:48,angle:45,type:'qalam'},strokes,variants:[strokes.map(s=>s.id)],...opts});
const D=(id,d)=>({id,kind:'drag',pathD:d});const P=(id,x,y)=>({id,kind:'press',points:[{x,y}]});
const LESSONS=[
 L('nuqta','Meet the nuqta','foundation','Press the nib flat and slide it one nib-width to make a diamond. Stack five from the top: that is the height of a Naskh alif.',[D('nuqta-1','M 483 381 L 517 347'),D('nuqta-2','M 483 449 L 517 415'),D('nuqta-3','M 483 517 L 517 483'),D('nuqta-4','M 483 585 L 517 551'),D('nuqta-5','M 483 653 L 517 619')]),
 L('descent','The descending stroke','foundation','Start high and move down with one steady movement.',[D('down','M 540 200 C 532 360 515 590 500 755')]),
 L('sweep','A gentle sweep','foundation','Move from right to left, keeping the curve unhurried.',[D('sweep','M 770 390 C 770 575 550 660 270 580')]),
 L('bowl','Finding the bowl','foundation','Let the curve descend, turn, and rise without retracing.',[D('bowl','M 740 340 C 790 530 650 720 465 720 C 280 720 245 570 300 405')]),
 L('alif','Alif · ا','letters','A Naskh alif stands five nuqtas tall. Keep it upright and steady, with a slight lean. Follow this draft model.',[D('alif','M 540 330 C 538 430 530 570 522 670')]),
 L('ba','Ba · ب','letters','Write the body first, then add its compact dot below.',[D('body','M 765 385 C 800 560 620 650 415 625 C 300 611 250 565 275 470'),P('dot',510,755)]),
 L('nun','Nun · ن','letters','Complete the bowl, lift your pen, and place the dot.',[D('body','M 720 365 C 785 555 655 730 480 730 C 300 730 250 580 310 425'),P('dot',510,315)]),
 L('lam','Lam · ل','letters','Bring the tall stroke into a rounded returning curve.',[D('lam','M 635 150 C 628 330 641 540 585 655 C 530 775 320 760 320 600')]),
 L('ba-join','A first connection · بب','connections','Keep the connection continuous. Add the two dots after the body.',[D('body','M 810 440 C 815 520 745 555 680 540 C 650 535 640 505 640 470 C 640 560 510 650 340 615 C 245 594 210 545 240 470'),P('right-dot',715,665),P('left-dot',425,750)],{variants:[['body','right-dot','left-dot'],['body','left-dot','right-dot']]})
];

const FOUNDATIONS=LESSONS.slice();
const WORD_TEXT='بِسْمِ';
const WORD_SOURCE={surah:1,ayah:1,word:1,label:'Al-Fatihah 1:1, opening word',text:WORD_TEXT,orthography:'Standard Arabic diacritics; not an Uthmani facsimile',url:'https://corpus.quran.com/wordmorphology.jsp?location=(1:1:1)',checkedAt:'2026-10-21'};
const W_BODY=[
 {...D('ba-body','M 795 330 C 796 365 808 411 790 447 C 752 470 694 479 651 460'),hint:'bodyStart'},
 {...D('sin-body','M 651 460 C 638 448 640 416 650 388 L 632 460 C 610 474 580 475 560 460 C 557 441 567 408 578 390 L 555 461 C 532 476 503 472 474 459 C 470 441 478 423 488 414 L 470 456 C 464 465 457 468 450 467'),hint:'sinMove'},
 {...D('mim-head','M 450 467 C 414 495 388 477 375 434 L 351 360 C 317 372 277 398 252 430 C 269 458 312 475 365 477 L 375 434'),hint:'mimMove'},
 {...D('mim-tail','M 252 430 C 249 484 259 559 265 620'),hint:'mimTail'}
];
const W_MARKS=[
 {...P('ba-dot',763,552),pen:{width:36,aspectRatio:1},tolerance:23,hint:'baDot'},
 {...D('ba-kasra','M 805 622 C 782 633 751 644 724 653'),pen:{width:25},tolerance:16,hint:'baKasra'},
 {...D('sin-sukun','M 588 270 C 588 246 552 246 552 270 C 552 294 588 294 588 270'),pen:{width:19},tolerance:13,hint:'sinSukun'},
 {...D('mim-kasra','M 376 563 C 351 574 319 584 293 592'),pen:{width:25},tolerance:16,hint:'mimKasra'}
];
const permute=a=>a.length<=1?[a]:a.flatMap((v,i)=>permute(a.filter((_,j)=>i!==j)).map(p=>[v,...p]));
const wordOptions={journey:true,source:WORD_SOURCE,pen:{width:43,angle:45,type:'qalam'},baseline:476};
const clone=a=>structuredClone(a);
const Q_LESSONS=[
 L('bism-ba','Ba: the beginning','quran','Follow the initial form of ba, then place its dot. This is one component, not the whole word.',clone([W_BODY[0],W_MARKS[0]]),{...wordOptions,labelKey:'baLabel',fit:true}),
 L('bism-sin','Sin: the rhythm','quran','Practise the medial sin and keep its three teeth connected.',clone([W_BODY[1]]),{...wordOptions,labelKey:'sinLabel',fit:true}),
 L('bism-mim','Mim: the finish','quran','Shape the final mim, then give its tail room to descend.',clone([W_BODY[2],W_BODY[3]]),{...wordOptions,labelKey:'mimLabel',fit:true}),
 L('bism-connect','Connect the body','quran','Bring ba, sin and mim together. The dot and vowel marks come next.',clone(W_BODY),{...wordOptions,labelKey:'joinLabel',lessonNote:'bodyNote'}),
 L('bism-marks','A place for every mark','quran','Place the ba dot, the two kasras, and the sukun on the prepared body.',clone(W_MARKS),{...wordOptions,labelKey:'marksLabel',lessonNote:'marksNote',contextStrokes:clone(W_BODY),variants:permute(W_MARKS.map(s=>s.id))}),
 L('bism-word','Bism: the complete word','quran','Write the complete opening word with its dot and vowel marks.',clone([...W_BODY,...W_MARKS]),{...wordOptions,labelKey:'wordLabel',lessonNote:'wordNote',variants:permute(W_MARKS.map(s=>s.id)).map(m=>[...W_BODY.map(s=>s.id),...m])})
];
LESSONS.push(...Q_LESSONS);

for(const l of Q_LESSONS){l.studyId='bism';l.review={status:'approved',reviewerId:null,provenance:'user_reported_calligrapher_approval',reportedAt:'2026-10-21',approvedModelVersion:'v2',scope:'Existing Bism movement geometry',writtenSignoff:null,releaseRequirement:'Named reviewer and written sign-off required before release'};l.completeWord=l.id==='bism-word';}
const ALLAH_TEXT='اللّٰهِ';
const ALLAH_SOURCE={surah:1,ayah:1,word:2,label:'Al-Fatihah 1:1, word 2',text:ALLAH_TEXT,orthography:'Standard Arabic spelling; not an Uthmani facsimile',url:'https://corpus.quran.com/wordmorphology.jsp?location=(1:1:2)',checkedAt:'2026-10-21'};
const A_BODY=[
 {...D('alif','M 740 300 C 730 330 735 355 744 378 C 742 470 740 572 740 665'),hint:'allahUpright'},
 {...D('lam-one','M 630 300 C 629 395 638 520 635 610 C 630 655 575 681 530 650'),hint:'allahLamOne'},
 {...D('lam-two','M 530 300 C 532 405 543 535 535 635 C 529 670 458 680 420 645'),hint:'allahLamTwo'},
 {...D('ha','M 420 645 C 409 603 403 537 400 485 C 357 506 313 540 290 575 C 312 605 357 617 414 615'),hint:'allahHa'}
];
const A_MARKS=[
 {...D('shadda','M 574 220 C 582 238 567 252 554 239 C 554 260 531 263 528 244 L 524 229'),pen:{width:17},tolerance:12,hint:'allahShadda'},
 {...D('dagger-alif','M 556 132 C 555 153 557 174 557 194'),pen:{width:14},tolerance:13,hint:'allahSmallAlif'},
 {...D('kasra','M 405 740 C 379 750 347 762 320 770'),pen:{width:25},tolerance:16,hint:'allahKasra'}
];
const allahOptions={version:2,journey:true,studyId:'allah',source:ALLAH_SOURCE,pen:{width:40,angle:45,type:'qalam'},baseline:650};
const ALLAH_LESSONS=[
 L('allah-stems','Alif and the two lams','quran','Give each upright its own space. Practise the turn at the foot of each lam.',clone(A_BODY.slice(0,3)),{...allahOptions,labelKey:'allahStems',fit:true}),
 L('allah-connect','Connect the body','quran','Keep the alif separate, connect the two lams and finish the enclosed ha.',clone(A_BODY),{...allahOptions,labelKey:'allahBody',lessonNote:'allahBodyNote'}),
 L('allah-word','Allah: the complete word','quran','Write the complete second word with its shadda, small alif and kasra.',clone([...A_BODY,...A_MARKS]),{...allahOptions,labelKey:'allahWord',lessonNote:'allahWordNote',completeWord:true,variants:permute(A_MARKS.map(m=>m.id)).map(m=>[...A_BODY.map(b=>b.id),...m])})
];
LESSONS.push(...ALLAH_LESSONS);
const STUDIES={bism:{id:'bism',name:'Bism',text:WORD_TEXT,source:WORD_SOURCE,lessons:Q_LESSONS,title:'journey',sub:'journeySub',steps:'journeySteps',marks:['mark1','mark2','mark3','mark4']},allah:{id:'allah',name:'Allah',text:ALLAH_TEXT,source:ALLAH_SOURCE,lessons:ALLAH_LESSONS,title:'allahTitle',sub:'allahSub',steps:'allahSteps',marks:['allahMark1','allahMark2','allahMark3']}};
const BASMALA_WORDS=[{id:'bism',name:'Bism',text:WORD_TEXT,word:1,ready:true},{id:'allah',name:'Allah',text:ALLAH_TEXT,word:2,ready:true},{id:'rahman',name:'Ar-Rahman',text:'الرَّحْمَٰنِ',word:3,ready:false},{id:'rahim',name:'Ar-Rahim',text:'الرَّحِيمِ',word:4,ready:false}];
const BASMALA_TEXT=BASMALA_WORDS.map(w=>w.text).join(' ');
for(const l of LESSONS)for(const s of l.strokes){if(s.kind==='drag'){const p=document.createElementNS(NS,'path');p.setAttribute('d',s.pathD);const len=p.getTotalLength();s.points=Array.from({length:Math.max(30,Math.ceil(len/7))},(_,i)=>{const a=p.getPointAtLength(len*i/(Math.max(30,Math.ceil(len/7))-1));return{x:a.x,y:a.y};});}}

for(const l of [...Q_LESSONS,...ALLAH_LESSONS]){
 l.pen={...l.pen};
 for(const st of l.contextStrokes||[]){const p=document.createElementNS(NS,'path');p.setAttribute('d',st.pathD);const n=Math.max(30,Math.ceil(p.getTotalLength()/7));st.points=Array.from({length:n},(_,i)=>{const a=p.getPointAtLength(p.getTotalLength()*i/(n-1));return{x:a.x,y:a.y};});}
 if(l.fit){const pts=l.strokes.flatMap(st=>st.points),minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));const k=Math.min(2.3,600/Math.max(maxX-minX,maxY-minY,1)),cx=(minX+maxX)/2,cy=(minY+maxY)/2;for(const st of l.strokes){st.points=st.points.map(p=>({x:(p.x-cx)*k+500,y:(p.y-cy)*k+470}));st.pen={...st.pen,width:(st.pen?.width||l.pen.width)*Math.min(k,1.5)};}l.pen.width*=Math.min(k,1.5);l.baseline=null;}
}


const CALIBRATION_LESSONS=[['cal-sukun','Sukun test','sin-sukun',Q_LESSONS.at(-1),'calSukun'],['cal-shadda','Shadda test','shadda',ALLAH_LESSONS.at(-1),'calShadda'],['cal-dagger','Small alif test','dagger-alif',ALLAH_LESSONS.at(-1),'calDagger']].map(([id,title,markId,parent,labelKey])=>({...parent,id,title:{en:title},goal:{en:'Trace this mark once at the original lesson size, then check it.'},labelKey,calibrationOnly:true,calibrationSourceId:parent.id,completeWord:false,fit:false,strokes:structuredClone([parent.strokes.find(st=>st.id===markId)]),contextStrokes:undefined,variants:[[markId]]}));
CALIBRATION_LESSONS.push({...Q_LESSONS.at(-1),id:'cal-bism',title:{en:'Complete Bism test'},labelKey:'calBism',calibrationOnly:true,calibrationSourceId:'bism-word',completeWord:false});
LESSONS.push(...CALIBRATION_LESSONS);
export const catalog={schemaVersion:1,coordinateSystem:{width:1000,height:1000,x:'right',y:'down'},lessons:LESSONS,foundationIds:FOUNDATIONS.map(l=>l.id),bismIds:Q_LESSONS.map(l=>l.id),allahIds:ALLAH_LESSONS.map(l=>l.id),calibrationIds:CALIBRATION_LESSONS.map(l=>l.id),studies:Object.fromEntries(Object.entries(STUDIES).map(([id,v])=>[id,{...v,lessons:v.lessons.map(l=>l.id)}])),words:BASMALA_WORDS,wordText:WORD_TEXT,wordSource:WORD_SOURCE,allahText:ALLAH_TEXT,allahSource:ALLAH_SOURCE,basmalaText:BASMALA_TEXT};
