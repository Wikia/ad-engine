import {
	adEnginePhases,
	context,
	DEFAULT_CONFIGURATION_PHASE_TTS,
	DEFAULT_INITIAL_PHASE_TTS,
	DEFAULT_PARTNERS_PHASE_TTS,
	DEFAULT_WAIT_AD_CALL_TIMEOUT,
	DEFAULT_WAIT_STACK_START_TIMEOUT,
	DiProcess,
	documentLoadedPromise,
	domContentLoadedPromise,
	eventsRepository,
	waitForEventPromise,
} from '@wikia/ad-engine';

export class AdEnginePhasesSetup implements DiProcess {
	execute(): void {
		adEnginePhases.initial = domContentLoadedPromise(
			context.get('options.phases.initialTts') || DEFAULT_INITIAL_PHASE_TTS,
		);

		adEnginePhases.configuration = documentLoadedPromise(
			context.get('options.phases.configurationTts') || DEFAULT_CONFIGURATION_PHASE_TTS,
		);

		adEnginePhases.partners = documentLoadedPromise(
			context.get('options.phases.partnersTts') || DEFAULT_PARTNERS_PHASE_TTS,
		);

		adEnginePhases.stackStart = waitForEventPromise(
			eventsRepository.AD_ENGINE_STACK_START,
			context.get('options.phases.adStackStartTimeout') || DEFAULT_WAIT_STACK_START_TIMEOUT,
		);

		adEnginePhases.firstAdCall = waitForEventPromise(
			eventsRepository.AD_ENGINE_SLOT_LOADED,
			context.get('options.phases.firstAdCallTimeout') || DEFAULT_WAIT_AD_CALL_TIMEOUT,
		);
	}
}
