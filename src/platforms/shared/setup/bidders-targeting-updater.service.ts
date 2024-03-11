import {
	Bidders,
	communicationService,
	DiProcess,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AD_ENGINE_SLOT_ADDED } from "../../../communication/events/events-ad-engine-slot";

const logGroup = 'ad-engine';

@Injectable()
export class BiddersTargetingUpdater implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		communicationService.on(
			AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				utils.logger(logGroup, `Added ad slot ${slot.getSlotName()}`);
				this.bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
