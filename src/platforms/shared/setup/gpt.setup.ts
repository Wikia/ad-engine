import { BaseServiceSetup, communicationService, eventsRepository, utils } from '@wikia/ad-engine';
import { MetricReporter } from '../tracking/metric-reporter';

const GPT_TIMEOUT_MS = 10 * 1000;
const GPT_LIBRARY_URL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

export class GptSetup extends BaseServiceSetup {
	options = { timeout: GPT_TIMEOUT_MS };
	private loadPromise: Promise<void>;

	call(): Promise<void> {
		if (!this.loadPromise) {
			utils.logger('gpt-provider', 'loading GPT...');
			this.loadPromise = utils.scriptLoader.loadScript(GPT_LIBRARY_URL).then(() => {
				utils.logger('gpt-provider', 'ready');
				communicationService.emit(eventsRepository.AD_ENGINE_GPT_READY, {
					time: utils.getTimeDelta(),
				});
				new MetricReporter().trackGptLibReady();
			});
		}
		return this.loadPromise;
	}
}
