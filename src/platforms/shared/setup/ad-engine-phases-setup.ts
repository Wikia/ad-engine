import {
	adEnginePhases,
	context,
	DiProcess,
	documentLoadedPromise,
	domContentLoadedPromise,
	eventsRepository,
	waitForEventPromise,
} from '@wikia/ad-engine';

const DEFAULT_CONFIGURATION_PHASE_WAIT_TIMEOUT = 200;
const DEFAULT_CONFIGURATION_PHASE_DELAY = 100;

const DEFAULT_PARTNERS_PHASE_WAIT_TIMEOUT = 700;
const DEFAULT_PARTNERS_PHASE_DELAY = 100;

const DEFAULT_AD_CALL_WAIT_TIMEOUT = 2000;

export class AdEnginePhasesSetup implements DiProcess {
	execute(): void {
		adEnginePhases.configuration = domContentLoadedPromise(
			context.get('options.phases.configurationTimeout') ??
				DEFAULT_CONFIGURATION_PHASE_WAIT_TIMEOUT,
			context.get('options.phases.configurationDelay') ?? DEFAULT_CONFIGURATION_PHASE_DELAY,
		);

		adEnginePhases.partners = documentLoadedPromise(
			context.get('options.phases.partnersTimeout') || DEFAULT_PARTNERS_PHASE_WAIT_TIMEOUT,
			context.get('options.phases.partnersDelay') || DEFAULT_PARTNERS_PHASE_DELAY,
		);

		adEnginePhases.firstAdCall = waitForEventPromise(
			eventsRepository.AD_ENGINE_SLOT_LOADED,
			context.get('options.phases.firstAdCallTimeout') || DEFAULT_AD_CALL_WAIT_TIMEOUT,
		);
	}
}
