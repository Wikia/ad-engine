import { BaseServiceSetup, utils } from '@wikia/ad-engine';

export class GptSetup extends BaseServiceSetup {
	call(): Promise<Event> {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		return utils.scriptLoader.loadScript(GPT_LIBRARY_URL);
	}
}
