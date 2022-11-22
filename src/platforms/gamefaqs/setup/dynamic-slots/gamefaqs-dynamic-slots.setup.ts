import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.ad');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotDiv = document.createElement('div');
			const adSlotName = placeholder.getAttribute('data-ad-type');
			adSlotDiv.id = adSlotName;

			placeholder.appendChild(adSlotDiv);
			context.push('state.adStack', { id: adSlotName });
		});
	}
}
