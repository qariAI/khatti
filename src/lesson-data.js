/** Hydrate ID references without DOM, evaluation or geometry mutation. */
export function hydrateLessons(source){
 const d=structuredClone(source),LESSONS=d.lessons,byId=new Map(LESSONS.map(l=>[l.id,l])),ids=a=>a.map(id=>{if(!byId.has(id))throw new Error('Unknown lesson '+id);return byId.get(id);});
 if(d.schemaVersion!==1||byId.size!==LESSONS.length)throw new Error('Invalid lesson catalog');
 return {LESSONS,FOUNDATIONS:ids(d.foundationIds),Q_LESSONS:ids(d.bismIds),ALLAH_LESSONS:ids(d.allahIds),CALIBRATION_LESSONS:ids(d.calibrationIds),STUDIES:Object.fromEntries(Object.entries(d.studies).map(([id,v])=>[id,{...v,lessons:ids(v.lessons)}])),BASMALA_WORDS:d.words,WORD_TEXT:d.wordText,WORD_SOURCE:d.wordSource,ALLAH_TEXT:d.allahText,ALLAH_SOURCE:d.allahSource,BASMALA_TEXT:d.basmalaText};
}
