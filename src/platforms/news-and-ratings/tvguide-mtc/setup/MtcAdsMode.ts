import { communicationService } from '@ad-engine/communication';
import { AdSlotEvent, slotService } from '@ad-engine/core';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { AdEngineStackSetup } from '@platforms/shared';
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
