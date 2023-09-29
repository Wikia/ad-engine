export const DEFAULT_INITIAL_PHASE_TTS = 500;
export const DEFAULT_CONFIGURATION_PHASE_TTS = 1000;
export const DEFAULT_PARTNERS_PHASE_TTS = 1500;

export const DEFAULT_WAIT_STACK_START_TIMEOUT = 2000;
export const DEFAULT_WAIT_AD_CALL_TIMEOUT = 1000;

export interface AdEnginePhases {
	initial: Promise<void>;
	configuration: Promise<void>;
	partners: Promise<void>;
	stackStart: Promise<void>;
	firstAdCall: Promise<void>;
}

// Needs to be setup by Pipeline to get configuration variables
export const adEnginePhases: AdEnginePhases = {
	initial: undefined,
	configuration: undefined,
	partners: undefined,
	stackStart: undefined,
	firstAdCall: undefined,
};

export * from './browser-phase-promise';
export * from './wait-for-event-promise';
