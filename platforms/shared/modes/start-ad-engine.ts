import { AdEngine, AdSlot, communicationService, Nativo, utils } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

export function startAdEngine(inhibitors: Promise<any>[] = []): void {
	if (!adEngineInstance) {
		const nativo = new Nativo();
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		if (nativo.isEnabled()) {
			nativo.load();
		}

		adEngineInstance = new AdEngine();
		adEngineInstance.init(inhibitors);

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});
	} else {
		adEngineInstance.runAdQueue(inhibitors);
	}
}
