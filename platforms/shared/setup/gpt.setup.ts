import { AdSlot, communicationService, ServiceStage, Service, utils } from '@wikia/ad-engine';

@Service({
	stage: ServiceStage.preProvider,
})
class GptSetup {
	call() {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});
	}
}

export const gptSetup = new GptSetup();
