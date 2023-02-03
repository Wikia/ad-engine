import { btfBlockerService, context, DiProcess } from '@wikia/ad-engine';

export class MetacriticDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.ad_unit');
		let firstCallSlotActive = false;

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotName = placeholder.id;

			if (adSlotName) {
				context.push('state.adStack', { id: adSlotName });

				if (this.isFirstCallSlot(adSlotName)) {
					firstCallSlotActive = true;
				}
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
