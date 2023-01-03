import { context, DiProcess } from '@wikia/ad-engine';

export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.mapped-ad,.ad');

		if (!adPlaceholders || adPlaceholders.length === 0) {
			console.warn('AdEngine did not find any ad placeholders. No ads on the page?');
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotName = placeholder.getAttribute('data-ad-type');
			const adWrapper = placeholder.firstElementChild;

			if (!adWrapper) {
				return;
			}

			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});
	}
}
