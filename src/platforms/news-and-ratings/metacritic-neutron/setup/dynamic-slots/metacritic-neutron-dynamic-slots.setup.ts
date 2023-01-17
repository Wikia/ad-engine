import { context, DiProcess } from '@wikia/ad-engine';

export class MetacriticNeutronDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.c-adDisplay_container');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adWrapper = placeholder.firstElementChild;

			if (!adWrapper) {
				return;
			}

			const adSlotName = adWrapper.getAttribute('data-ad');
			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});
	}
}
