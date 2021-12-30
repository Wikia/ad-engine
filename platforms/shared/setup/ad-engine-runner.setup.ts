import {
	bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'ad-engine';

@Injectable()
export class AdEngineRunnerSetup implements DiProcess {
	constructor() {}

	execute(): void {
		communicationService.listen(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				utils.logger(logGroup, `Created ad slot ${slot.getSlotName()}`);
				bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
