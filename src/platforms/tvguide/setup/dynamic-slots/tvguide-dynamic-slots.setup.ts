import { context, DiProcess } from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	private adPlaceholderSelector = 'c-adDisplay_container';

	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll(`.${this.adPlaceholderSelector}`);

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
		const adSlotNameSelector = `${this.adPlaceholderSelector}_`;

		placeholder.classList.forEach((className) => {
			if (className.includes(adSlotNameSelector)) {
				adSlotName = className.slice(adSlotNameSelector.length);
			}
		});

		return adSlotName;
	}
}
