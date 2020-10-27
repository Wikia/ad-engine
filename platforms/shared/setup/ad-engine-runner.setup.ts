import { bidders, DiProcess, events, eventService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'ad-engine';

@Injectable()
export class AdEngineRunnerSetup implements DiProcess {
	constructor() {}

	execute(): void {
		eventService.on(events.AD_SLOT_CREATED, (slot) => {
			utils.logger(logGroup, `Created ad slot ${slot.getSlotName()}`);
			bidders.updateSlotTargeting(slot.getSlotName());
		});
	}
}
