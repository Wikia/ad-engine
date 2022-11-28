import { context, DiProcess } from '@wikia/ad-engine';

export class TvguideDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.c-adDisplay');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotDiv = document.createElement('div');
			const adSlotName = placeholder.getAttribute('data-ad');
			adSlotDiv.id = adSlotName;

			placeholder.appendChild(adSlotDiv);
			context.push('state.adStack', { id: adSlotName });
		});
	}
}
