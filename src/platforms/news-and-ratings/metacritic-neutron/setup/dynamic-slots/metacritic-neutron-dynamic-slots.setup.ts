import { btfBlockerService, context, DiProcess } from '@wikia/ad-engine';

export class MetacriticNeutronDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.c-adDisplay_container');
		let firstCallSlotActive = false;

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

			if (this.isFirstCallSlot(adSlotName)) {
				firstCallSlotActive = true;
			}
		});

		if (!firstCallSlotActive) {
			btfBlockerService.finishFirstCall();
		}
	}

	private isFirstCallSlot(slotName: string): boolean {
		return context.get(`slots.${slotName}.firstCall`);
	}
}
