import {
	AdEngine,
	AdSlot,
	babDetection,
	btRec,
	eventService,
	Inhibitor,
	utils,
} from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

export function startAdEngine(inhibitors: Inhibitor[] = []): void {
	const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

	utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

	const engine = new AdEngine(null, inhibitors);

	engine.init();

	if (babDetection.isEnabled()) {
		babDetection.run().then((isBabDetected) => {
			trackBab(isBabDetected);

			if (isBabDetected) {
				btRec.run();
			}
		});
	}

	eventService.on(AdSlot.SLOT_RENDERED_EVENT, (slot) => {
		slot.removeClass('default-height');
	});
}
