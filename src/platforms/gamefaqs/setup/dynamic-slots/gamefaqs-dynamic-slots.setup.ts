import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const activeSlots = ['leader_plus_top', 'leader_top', 'mpu_plus_top', 'mpu_top'];

		activeSlots.map((slotName) => {
			const adSlot = document.createElement('div');
			adSlot.id = slotName;

			const adSlotContainer = document.querySelector(`.ad.ad_${slotName}`);

			if (adSlotContainer) {
				adSlotContainer.appendChild(adSlot);
				context.push('state.adStack', { id: slotName });
			}
		});
	}
}
