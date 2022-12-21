import { context, DiProcess } from '@wikia/ad-engine';

export class GamespotDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.mapped-ad');

		if (!adPlaceholders) {
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
