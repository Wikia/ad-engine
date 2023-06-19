import {
	AdSlot,
	AdSlotStatus,
	communicationService,
	context,
	eventsRepository,
} from '@wikia/ad-engine';

export class TlbStickyHandler {
	private readonly slotName = 'top_leaderboard';
	private icbmStickyTlbRemovingByCampainsData;

	constructor() {
		this.icbmStickyTlbRemovingByCampainsData = context.get('templates.stickyTlb.removeByGamAd');
	}

	handle() {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			this.handleOnLoad();
		});
	}

	handleOnLoad(): void {
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_SUCCESS,
			({ slot }) => {
				console.log(
					'SUCCESS! - should we remove sticky?',
					this.isLoadedGamAdOnIcbmRemovingList(slot),
				);
			},
			this.slotName,
		);
	}

	private isLoadedGamAdOnIcbmRemovingList(slot: AdSlot): boolean {
		return Object.keys(this.icbmStickyTlbRemovingByCampainsData).includes(`${slot.lineItemId}`);
	}
}
