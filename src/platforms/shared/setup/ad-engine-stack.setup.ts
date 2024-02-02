import { communicationService } from '@ad-engine/communication';
import { AdEngine, AdSlotEvent } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';

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
