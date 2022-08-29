import {
	biddersDeprecated,
	communicationService,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'ad-engine';

@Injectable()
export class AdEngineRunnerSetup implements DiProcess {
	execute(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				utils.logger(logGroup, `Added ad slot ${slot.getSlotName()}`);
				biddersDeprecated.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
