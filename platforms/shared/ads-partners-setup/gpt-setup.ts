import { AdEngine, AdSlot, BaseServiceSetup, communicationService, utils } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

class GptSetup extends BaseServiceSetup {
	initialize() {
		this.res();
		if (!adEngineInstance) {
			const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

			utils.logger('gpt-provider', 'loading GPT...');
			utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

			adEngineInstance = new AdEngine();
			adEngineInstance.init();

			communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
				slot.removeClass('default-height');
			});
		} else {
			adEngineInstance.runAdQueue();
			this.res();
		}
	}
}

export const gptSetup = new GptSetup();
