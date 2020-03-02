import { AdEngine, AdSlot, eventService, utils } from '@wikia/ad-engine';

export function startAdEngine(inhibitors: Promise<any>[] = []): void {
	const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

	utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

	const engine = new AdEngine();

	engine.init(inhibitors);

	eventService.on(AdSlot.SLOT_RENDERED_EVENT, (slot) => {
		slot.removeClass('default-height');
	});
}
