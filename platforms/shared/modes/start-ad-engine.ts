import {
	AdEngine,
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

function checkSilverSurferAvailability() {
	return window.SilverSurferSDK?.isInitialized() && window.SilverSurferSDK?.requestUserPPID;
}

function setupPPID(): void {
	if (checkSilverSurferAvailability() && context.get('services.ppid.enabled')) {
		window.SilverSurferSDK.requestUserPPID();

		communicationService.on(eventsRepository.IDENTITY_RESOLUTION_PPID_UPDATED, ({ ppid }) => {
			setPPID(ppid);
		});
	}
}

function setPPID(ppid: string) {
	const tag = window.googletag.pubads();
	tag.setPublisherProvidedId(ppid);
	context.set('targeting.ppid', ppid);
}

export function startAdEngine(inhibitors: Promise<any>[] = []): void {
	if (!adEngineInstance) {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);
		setupPPID();

		adEngineInstance = new AdEngine();
		adEngineInstance.init(inhibitors);

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});
	} else {
		adEngineInstance.runAdQueue(inhibitors);
	}
}
