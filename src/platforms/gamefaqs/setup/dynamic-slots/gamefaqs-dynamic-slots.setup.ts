import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.wrapActiveAdSlots();
	}

	private wrapActiveAdSlots(): void {
		const activeSlots = ['leader_plus_top', 'mpu_top'];

		activeSlots.map((slotName) => {
			const container = document.createElement('div');
			container.id = slotName;

			document.querySelector(`.ad.ad_${slotName}`).appendChild(container);

			context.push('state.adStack', { id: slotName });
		});
	}
}
