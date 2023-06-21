import { AdEngine, AdSlotEvent, BaseServiceSetup, communicationService } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

export class AdEngineStackSetup extends BaseServiceSetup {
	call(): Promise<void> {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});

		adEngineInstance = new AdEngine();
		return adEngineInstance.init();
	}
}
