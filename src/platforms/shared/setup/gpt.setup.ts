import { BaseServiceSetup, communicationService, eventsRepository, utils } from '@wikia/ad-engine';

const GPT_TIMEOUT_MS = 10 * 1000;
const GPT_LIBRARY_URL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

export class GptSetup extends BaseServiceSetup {
	private loadPromise: Promise<void>;

	options = { timeout: GPT_TIMEOUT_MS };

	call(): Promise<void> {
		if (!this.loadPromise) {
			utils.logger('gpt-provider', 'loading GPT...');
			this.loadPromise = utils.scriptLoader.loadScript(GPT_LIBRARY_URL).then(() => {
				utils.logger('gpt-provider', 'ready');
				communicationService.emit(eventsRepository.AD_ENGINE_GPT_READY, {
					time: utils.getTimeDelta(),
				});
			});
		}
		return this.loadPromise;
	}
}
