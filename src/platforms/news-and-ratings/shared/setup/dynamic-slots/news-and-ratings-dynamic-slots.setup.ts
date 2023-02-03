import { btfBlockerService, context, DiProcess, utils } from '@wikia/ad-engine';

export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.mapped-ad,.ad');
		let firstCallSlotActive = false;

		if (!adPlaceholders || adPlaceholders.length === 0) {
			console.warn('AdEngine did not find any ad placeholders');
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

			if (this.isFirstCallSlot(adSlotName)) {
				firstCallSlotActive = true;
			}
		});

		if (!firstCallSlotActive) {
			btfBlockerService.finishFirstCall();
		}
	}

	private isSlotLazyLoaded(slotName: string): boolean {
		return context.get(`slots.${slotName}.lazyLoad`);
	}

	private isFirstCallSlot(slotName: string): boolean {
		return context.get(`slots.${slotName}.firstCall`);
	}
}
