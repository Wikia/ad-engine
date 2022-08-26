export enum PartnerServiceStage {
	'baseSetup',
	'preProvider',
	'provider',
	'afterProvider',
}
export type PartnerStepUnion = PartnerInitializationProcess | FuncProcess | any;

export interface PartnerInitializationProcessOptions {
	dependencies?: any;
	timeout?: number;
	stage?: PartnerServiceStage;
}

export interface PartnerInitializationProcess {
	execute(): Promise<void> | void;
	initialized: Promise<void>;
	setOptions: (opt: PartnerInitializationProcessOptions) => PartnerInitializationProcess;
	resolve: () => void;
}

export type FuncProcess = (
	options: PartnerInitializationProcessOptions,
) => PartnerInitializationProcess;
