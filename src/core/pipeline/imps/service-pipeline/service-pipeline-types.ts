export enum ServiceStage {
	'baseSetup',
	'preProvider',
	'provider',
}
export type ServiceStepUnion = ServiceInitializationProcess | FuncProcess | any;

export interface ServiceInitializationProcessOptions {
	dependencies?: any;
	timeout?: number;
	stage?: ServiceStage;
}

export interface ServiceInitializationProcess {
	execute(): Promise<void> | void;
	initialized: Promise<void>;
	setOptions: (opt: ServiceInitializationProcessOptions) => ServiceInitializationProcess;
	resolve: () => void;
}

export type FuncProcess = (
	options: ServiceInitializationProcessOptions,
) => ServiceInitializationProcess;
