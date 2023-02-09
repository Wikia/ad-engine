import { context, DiProcess, utils } from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	private alreadyPushedSlots = {};

	execute(): void {
		const adPlaceholders = document.querySelectorAll('.c-adDisplay_container');

		if (!adPlaceholders) {
			return;
		}

		new utils.WaitFor(() => this.adDivsReady(adPlaceholders), 10, 100)
			.until()
			.then(() => this.injectSlots(adPlaceholders));
	}

	private injectSlots(adPlaceholders): void {
		adPlaceholders.forEach((placeholder) => {
			const adWrapper = placeholder.firstElementChild;

			if (!adWrapper) {
				return;
			}

			const adSlotName = adWrapper.getAttribute('data-ad');
			adWrapper.id = adSlotName;

			if (this.isSlotDefinedInContext(adSlotName)) {
				return;
			}

			if (this.isRepeatableSlot(adSlotName) && this.isAlreadyPushedSlot(adSlotName)) {
				this.alreadyPushedSlots[adSlotName]++;
				const repeatedSlotName = `${adSlotName}-${this.alreadyPushedSlots[adSlotName]}`;
				adWrapper.id = repeatedSlotName;
				return;
			}

			context.push('state.adStack', { id: adSlotName });
			this.alreadyPushedSlots[adSlotName] = 1;
		});
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return !Object.keys(context.get('slots')).includes(slotName);
	}

	private isRepeatableSlot(slotName: string): boolean {
		return context.get(`slots.${slotName}.repeat`);
	}

	private isAlreadyPushedSlot(slotName: string): boolean {
		return this.alreadyPushedSlots[slotName];
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	adDivsReady(adPlaceholders) {
		const firstPlaceholder = adPlaceholders[0];

		const adDiv = firstPlaceholder.firstElementChild;

		return !!adDiv;
	}
}
