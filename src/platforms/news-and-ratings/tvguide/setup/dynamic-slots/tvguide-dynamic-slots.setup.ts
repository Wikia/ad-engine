import { context, DiProcess, utils } from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
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
		let slotCounter = 1;

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

			if (this.isIncrementalSlot(adSlotName)) {
				const repeatedAdSlotName = `${adSlotName}-${slotCounter}`;
				adWrapper.id = repeatedAdSlotName;

				context.set(`slots.${repeatedAdSlotName}`, {
					...context.get(`slots.${adSlotName}`),
				});
				context.set(`slots.${repeatedAdSlotName}.targeting.pos`, repeatedAdSlotName);

				context.push('state.adStack', { id: repeatedAdSlotName });

				slotCounter++;
			} else {
				context.push('state.adStack', { id: adSlotName });
			}
		});
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return !Object.keys(context.get('slots')).includes(slotName);
	}

	private isIncrementalSlot(slotName: string): boolean {
		return context.get(`slots.${slotName}.incremental`);
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	adDivsReady(adPlaceholders) {
		const firstPlaceholder = adPlaceholders[0];

		const adDiv = firstPlaceholder.firstElementChild;

		return !!adDiv;
	}
}
