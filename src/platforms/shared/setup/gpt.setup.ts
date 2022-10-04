import { AdEngine, AdSlot, BaseServiceSetup, communicationService, utils } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

class GptSetup extends BaseServiceSetup {
	call() {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		adEngineInstance = new AdEngine();
		adEngineInstance.init();

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});
	}
}

export const gptSetup = new GptSetup();
