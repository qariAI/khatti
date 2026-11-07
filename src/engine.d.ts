/** Types for the unchanged JavaScript geometry engine. No framework dependency. */
export type InputType = 'touch' | 'pen' | 'mouse';
export interface Point { x:number; y:number; p?:number; t?:number; }
export interface UserStroke { points:Point[]; }
export interface TargetStroke { id:string; kind:'drag'|'press'; points:Point[]; tolerance?:number; pathD?:string; }
export interface Lesson { id:string; strokes:TargetStroke[]; variants?:string[][]; }
export interface StrokeMetric { shape:number; direction:number|null; placement:number; coverage:number; precision:number; qualified:boolean; reason:string; }
export interface Evaluation { score:number; qualified:boolean; metrics:StrokeMetric[]; coverage:number; shape:number; direction:number|null; placement:number; sequenceScore:number; reason:string; badIndex:number; sequence:string[]; extra:number; version:string; silhouette:null; }
export function dist(a:Point,b:Point):number;
export function clamp(value:number,min?:number,max?:number):number;
export function length(points:Point[]):number;
export function resample(points:Point[],count?:number):Point[];
export function nearest(a:Point,points:Point[]):{distance:number;index:number};
export function dtw(a:Point[],b:Point[],band?:number):number;
export function strokeMetric(user:UserStroke|undefined,target:TargetStroke,tolerance:number,input?:InputType):StrokeMetric;
export function evaluate(strokes:UserStroke[],lesson:Lesson,input?:InputType):Evaluation;
export function hull(points:Point[]):Point[];
