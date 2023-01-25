import {
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'ad-engine';

@Injectable()
export class AdEngineRunnerSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				utils.logger(logGroup, `Added ad slot ${slot.getSlotName()}`);
				this.bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
