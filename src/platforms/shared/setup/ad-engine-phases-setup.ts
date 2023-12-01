import {
	adEnginePhases,
	context,
	DiProcess,
	documentLoadedPromise,
	domContentLoadedPromise,
	eventsRepository,
	utils,
	waitForEventPromise,
} from '@wikia/ad-engine';

const DEFAULT_INITIAL_PHASE_TTS = 550;

const DEFAULT_CONFIGURATION_PHASE_WAIT_TIMEOUT = 550;
const DEFAULT_CONFIGURATION_PHASE_DELAY = 50;

const DEFAULT_PARTNERS_PHASE_WAIT_TIMEOUT = 650;
const DEFAULT_PARTNERS_PHASE_DELAY = 50;

const DEFAULT_STACK_START_WAIT_TIMEOUT = 2000;
const DEFAULT_AD_CALL_WAIT_TIMEOUT = 5000;

export class AdEnginePhasesSetup implements DiProcess {
	execute(): void {
		if (this.shouldWaitForDomContentLoaded()) {
			adEnginePhases.initial = domContentLoadedPromise(
				context.get('options.phases.initialTts') || DEFAULT_INITIAL_PHASE_TTS,
			);
		}

		if (this.shouldWaitForDocumentLoaded()) {
			adEnginePhases.configuration = documentLoadedPromise(
				context.get('options.phases.configurationTimeout') ||
					DEFAULT_CONFIGURATION_PHASE_WAIT_TIMEOUT,
				context.get('options.phases.configurationDelay') || DEFAULT_CONFIGURATION_PHASE_DELAY,
			);

			adEnginePhases.partners = documentLoadedPromise(
				context.get('options.phases.partnersTimeout') || DEFAULT_PARTNERS_PHASE_WAIT_TIMEOUT,
				context.get('options.phases.partnersDelay') || DEFAULT_PARTNERS_PHASE_DELAY,
			);
		}

		adEnginePhases.stackStart = waitForEventPromise(
			eventsRepository.AD_ENGINE_STACK_START,
			context.get('options.phases.adStackStartTimeout') || DEFAULT_STACK_START_WAIT_TIMEOUT,
		);

		adEnginePhases.firstAdCall = waitForEventPromise(
			eventsRepository.AD_ENGINE_SLOT_LOADED,
			context.get('options.phases.firstAdCallTimeout') || DEFAULT_AD_CALL_WAIT_TIMEOUT,
		);
	}

	private shouldWaitForDomContentLoaded(): boolean | undefined {
		return window.ads?.context?.domWait || utils.queryString.get('domWait') == '1';
	}

	private shouldWaitForDocumentLoaded(): boolean | undefined {
		return window.ads?.context?.docWait || utils.queryString.get('docWait') == '1';
	}
}
