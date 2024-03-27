export interface AdEnginePhases {
	configuration: Promise<void>;
	partners: Promise<void>;
	firstAdCall: Promise<void>;
}

// Needs to be setup by Pipeline to get configuration variables
export const adEnginePhases: AdEnginePhases = {
	configuration: Promise.resolve(),
	partners: Promise.resolve(),
	firstAdCall: Promise.resolve(),
};
