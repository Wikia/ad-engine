import { context, DiProcess } from '@wikia/ad-engine';

export class TvguideDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.c-adDisplay_container');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotDiv = document.createElement('div');
			const adSlotName = this.getAdSlotNameFromPlaceholder(placeholder);
			adSlotDiv.id = adSlotName;

			placeholder.appendChild(adSlotDiv);
			context.push('state.adStack', { id: adSlotName });
		});
	}

	getAdSlotNameFromPlaceholder(placeholder: Element) {
		let adSlotName = null;

		placeholder.classList.forEach((className) => {
			if (className.includes('c-adDisplay_container_')) {
				adSlotName = className.slice('c-adDisplay_container_'.length);
			}
		});

		return adSlotName;
	}
}
