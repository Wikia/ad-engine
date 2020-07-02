import { Type } from '../../../models/dictionary';

export type ProcessStepUnion<T = any> = ProcessStep | CompoundProcessStep<T>;

export type ProcessStep = Type<DiProcess> | FuncProcess;

export interface DiProcess {
	execute(): Promise<void> | void;
}

export type FuncProcess = () => Promise<void> | void;

export function isDiProcess(step: ProcessStep): step is Type<DiProcess> {
	return typeof step.prototype.execute === 'function';
}

export interface CompoundProcess<T> {
	execute(payload: T): Promise<void> | void;
}

export interface CompoundProcessStep<T> {
	process: Type<CompoundProcess<T>>;
	payload: T;
}

export function isCompoundProcessStep<T>(
	step: ProcessStepUnion<T>,
): step is CompoundProcessStep<T> {
	return (
		typeof step === 'object' &&
		'process' in step &&
		typeof step.process.prototype.execute === 'function'
	);
}
