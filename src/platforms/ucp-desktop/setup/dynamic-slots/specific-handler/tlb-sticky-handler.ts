import {
	AdSlot,
	AdSlotStatus,
	communicationService,
	context,
	eventsRepository,
} from '@wikia/ad-engine';

export class TlbStickyHandler {
	private readonly slotName = 'top_leaderboard';
	private icbmStickyTlbActivateByCampainsData;

	constructor() {
		this.icbmStickyTlbActivateByCampainsData = context.get('templates.stickyTlb.activateByGamAd');
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
				if (this.isLoadedGamAdOnIcbmActivationList(slot)) {
					context.push(`slots.${this.slotName}.defaultTemplates`, 'stickyTlb');
				}
			},
			this.slotName,
		);
	}

	private isLoadedGamAdOnIcbmActivationList(slot: AdSlot): boolean {
		return Object.keys(this.icbmStickyTlbActivateByCampainsData).includes(`${slot.lineItemId}`);
	}
}
