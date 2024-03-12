import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { getTimeDelta, logger, scriptLoader } from '@ad-engine/utils';

const GPT_TIMEOUT_MS = 10 * 1000;
const GPT_LIBRARY_URL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

export class GptSetup extends BaseServiceSetup {
	private loadPromise: Promise<void>;

	options = { timeout: GPT_TIMEOUT_MS };

	call(): Promise<void> {
		if (!this.loadPromise) {
			logger('gpt-provider', 'loading GPT...');
			this.loadPromise = scriptLoader.loadScript(GPT_LIBRARY_URL).then(() => {
				logger('gpt-provider', 'ready');
				communicationService.emit(eventsRepository.AD_ENGINE_GPT_READY, {
					time: getTimeDelta(),
				});
			});
		}
		return this.loadPromise;
	}
}
