import { AdEngine, AdSlot, eventService, utils } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

export function startAdEngine(inhibitors: Promise<any>[] = []): void {
	if (!adEngineInstance) {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		adEngineInstance = new AdEngine();
		adEngineInstance.init(inhibitors);

		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (slot) => {
			slot.removeClass('default-height');
		});
	} else {
		adEngineInstance.runAdQueue(inhibitors);
	}
}
