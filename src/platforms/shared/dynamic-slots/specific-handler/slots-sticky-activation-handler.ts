import {
	AdSlot,
	AdSlotStatus,
	communicationService,
	context,
	eventsRepository,
} from '@wikia/ad-engine';

export class SlotsStickyActivationHandler {
	private icbmStickyTlbActivateByCampainsData;

	constructor(private slotNames: string[]) {
		this.icbmStickyTlbActivateByCampainsData = context.get('templates.stickyTop.activateByGamAd');
		console.log('!!', this.icbmStickyTlbActivateByCampainsData);
	}

	handle() {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			this.slotNames.forEach((slotName: string) => {
				this.handleOnLoad(slotName);
			});
		});
	}

	handleOnLoad(slotName: string): void {
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_SUCCESS,
			({ slot }) => {
				console.log('SUCCESS!', slotName, slot, this.isLoadedGamAdOnIcbmActivationList(slot));
				if (this.isLoadedGamAdOnIcbmActivationList(slot)) {
					context.push(`slots.${slotName}.defaultTemplates`, 'stickyLocTop');
				}
			},
			slotName,
		);
	}

	private isLoadedGamAdOnIcbmActivationList(slot: AdSlot): boolean {
		return Object.keys(this.icbmStickyTlbActivateByCampainsData).includes(`${slot.lineItemId}`);
	}
}
