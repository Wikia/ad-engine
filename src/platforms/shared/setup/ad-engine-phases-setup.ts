import {
	adEnginePhases,
	context,
	DiProcess,
	documentLoadedPromise,
	domContentLoadedPromise,
	eventsRepository,
	waitForEventPromise,
} from '@wikia/ad-engine';

const DEFAULT_INITIAL_PHASE_TTS = 700;

const DEFAULT_CONFIGURATION_PHASE_WAIT_TIMEOUT = 700;
const DEFAULT_CONFIGURATION_PHASE_DELAY = 100;

const DEFAULT_PARTNERS_PHASE_WAIT_TIMEOUT = 800;
const DEFAULT_PARTNERS_PHASE_DELAY = 200;

const DEFAULT_STACK_START_WAIT_TIMEOUT = 2000;
const DEFAULT_AD_CALL_WAIT_TIMEOUT = 1000;

export class AdEnginePhasesSetup implements DiProcess {
	execute(): void {
		adEnginePhases.initial = domContentLoadedPromise(
			context.get('options.phases.initialTts') || DEFAULT_INITIAL_PHASE_TTS,
		);

		adEnginePhases.configuration = documentLoadedPromise(
			context.get('options.phases.configurationTimeout') ||
				DEFAULT_CONFIGURATION_PHASE_WAIT_TIMEOUT,
			context.get('options.phases.configurationDelay') || DEFAULT_CONFIGURATION_PHASE_DELAY,
		);

		adEnginePhases.partners = documentLoadedPromise(
			context.get('options.phases.partnersTimeout') || DEFAULT_PARTNERS_PHASE_WAIT_TIMEOUT,
			context.get('options.phases.partnersDelay') || DEFAULT_PARTNERS_PHASE_DELAY,
		);

		adEnginePhases.stackStart = waitForEventPromise(
			eventsRepository.AD_ENGINE_STACK_START,
			context.get('options.phases.adStackStartTimeout') || DEFAULT_STACK_START_WAIT_TIMEOUT,
		);

		adEnginePhases.firstAdCall = waitForEventPromise(
			eventsRepository.AD_ENGINE_SLOT_LOADED,
			context.get('options.phases.firstAdCallTimeout') || DEFAULT_AD_CALL_WAIT_TIMEOUT,
		);
	}
}
