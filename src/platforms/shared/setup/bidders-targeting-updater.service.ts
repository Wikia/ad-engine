import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import { Bidders } from '@wikia/ad-bidders';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'ad-engine';

@Injectable()
export class BiddersTargetingUpdater implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				logger(logGroup, `Added ad slot ${slot.getSlotName()}`);
				this.bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
