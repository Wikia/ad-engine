import { BaseServiceSetup, utils } from '@wikia/ad-engine';

const GPT_TIMEOUT_MS = 10 * 1000;

export class GptSetup extends BaseServiceSetup {
	constructor() {
		super();
		this.options = { timeout: GPT_TIMEOUT_MS };
	}

	call(): Promise<void> {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		utils.scriptLoader.loadScript(GPT_LIBRARY_URL).then(() => {
			utils.logger('gpt-provider', 'ready');
		});
		return Promise.resolve();
	}
}
