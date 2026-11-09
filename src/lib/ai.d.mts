import type { LearningSettings } from './learning/catalog';
export function aiStatus():Promise<{configured:boolean;provider:string;model:string}>;
export function generateLearning(owner:string,input:{topic:string;format:'words'|'quiz'|'text'|'slides'}):Promise<LearningSettings>;
