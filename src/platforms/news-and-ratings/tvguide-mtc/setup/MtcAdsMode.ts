import { AdEngineStackSetup } from '@platforms/shared';
import {
	AdSlotEvent,
	communicationService,
	DiProcess,
	PartnerPipeline,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MtcAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private adEngineStackSetup: AdEngineStackSetup) {}

	execute(): void {
		this.pipeline.add(this.adEngineStackSetup).execute();
		this.prepareFakeGptEvents();
	}

	private prepareFakeGptEvents() {
		communicationService.onSlotEvent(
			AdSlotEvent.SHOWED_EVENT,
			() => {
				const adSlot = slotService.get('top-leaderboard');

				if (adSlot) {
					adSlot.emit(AdSlotEvent.SLOT_LOADED_EVENT);
				}
			},
			'top-leaderboard',
			true,
		);

		communicationService.onSlotEvent(
			AdSlotEvent.SHOWED_EVENT,
			() => {
				const adSlot = slotService.get('mtop-leaderboard');

				if (adSlot) {
					adSlot.emit(AdSlotEvent.SLOT_LOADED_EVENT);
				}
			},
			'mtop-leaderboard',
			true,
		);
	}
}
