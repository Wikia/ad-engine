export type PartnerStepUnion = PartnerInitializationProcess | FuncProcess;

export interface PartnerInitializationProcessOptions {
	dependencies?: Promise<any>[];
	timeout?: number;
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
