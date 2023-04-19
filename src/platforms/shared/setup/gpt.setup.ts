import { AdEngine, AdSlot, BaseServiceSetup, communicationService, utils } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

export class GptSetup extends BaseServiceSetup {
	call(): Promise<Event> {
		utils.logger('GPT Setup', 'Called');
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		const gptLoaded = utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		adEngineInstance = new AdEngine();
		adEngineInstance.init();

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});

		return gptLoaded;
	}
}
