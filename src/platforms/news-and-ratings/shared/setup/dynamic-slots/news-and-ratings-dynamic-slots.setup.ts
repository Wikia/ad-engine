import { context, DiProcess, utils } from '@wikia/ad-engine';

export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.ad');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder: Element) => {
			const adSlotName = placeholder.getAttribute('data-ad-type');
			const adWrapper = utils.Document.getFirstElementChild(placeholder);

			if (!adWrapper) {
				return;
			}

			adWrapper.id = adSlotName;

			if (this.isSlotLazyLoaded(adSlotName)) {
				context.push('events.pushOnScroll.ids', adSlotName);
			} else {
				context.push('state.adStack', { id: adSlotName });
			}
		});
	}

	private isSlotLazyLoaded(slotName: string): boolean {
		return context.get(`slots.${slotName}.lazyLoad`);
	}
}
