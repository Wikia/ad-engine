import {
	AdEngine,
	AdSlot,
	context,
	communicationService,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

function sendNativoLoadStatus(status: string, event?: any): void {
	const adLocation = event?.data[0].adLocation || '';
	const payload = {
		event: status,
		adSlotName: adLocation,
		payload: {
			adLocation: adLocation,
			provider: 'nativo',
		},
	};

	communicationService.dispatch(
		communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)(payload),
	);
}

export function startAdEngine(inhibitors: Promise<any>[] = []): void {
	if (!adEngineInstance) {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';
		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		if (context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds')) {
			const NATIVO_LIBRARY_URL = '//s.ntv.io/serve/load.js';
			utils.scriptLoader
				.loadScript(
					NATIVO_LIBRARY_URL,
					'text/javascript',
					true,
					null,
					{},
					{ ntvSetNoAutoStart: '' },
				)
				.then(() => {
					sendNativoLoadStatus(AdSlot.SLOT_ADDED_EVENT);
				});
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
