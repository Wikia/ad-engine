export interface AdEnginePhases {
	initial: Promise<void>;
	configuration: Promise<void>;
	partners: Promise<void>;
	stackStart: Promise<void>;
	firstAdCall: Promise<void>;
}

// Needs to be setup by Pipeline to get configuration variables
export const adEnginePhases: AdEnginePhases = {
	initial: Promise.resolve(),
	configuration: Promise.resolve(),
	partners: Promise.resolve(),
	stackStart: Promise.resolve(),
	firstAdCall: Promise.resolve(),
};
