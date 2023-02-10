import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	slotService,
	utils,
} from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	execute(): void {
		const repeatableSLots = ['incontent-leader-plus-inc'];
		const adPlaceholders = document.querySelectorAll('.c-adDisplay_container');

		if (!adPlaceholders) {
			return;
		}

		repeatableSLots.forEach((slot) => {
			this.setupRepeatableSlot(slot);
		});

		new utils.WaitFor(() => this.adDivsReady(adPlaceholders), 10, 100)
			.until()
			.then(() => this.injectSlots(adPlaceholders));
	}

	private injectSlots(adPlaceholders): void {
		const pushedSlots = [];

		adPlaceholders.forEach((placeholder) => {
			const adWrapper = placeholder.firstElementChild;

			if (!adWrapper) {
				return;
			}

			const adSlotName = adWrapper.getAttribute('data-ad');

			if (pushedSlots.includes(adSlotName)) {
				return;
			}

			pushedSlots.push(adSlotName);
			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});
	}

	private setupRepeatableSlot(slotName, slotNameBase = '') {
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				const adSlot = slotService.get(slotName);
				const nextIndex = adSlot.getConfigProperty('repeat.index') + 1;
				const nextSlotName = `${slotNameBase || slotName}-${nextIndex}`;
				const nextSlotPlace = document.querySelector(
					`.c-adDisplay_container > div[data-ad="${slotNameBase || slotName}"]:not(.gpt-ad)`,
				);

				if (!nextSlotPlace) {
					return;
				}

				this.setupRepeatableSlot(nextSlotName, slotNameBase || slotName);
				nextSlotPlace.id = nextSlotName;
				context.push('state.adStack', { id: nextSlotName });
			},
			slotName,
			true,
		);
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	adDivsReady(adPlaceholders) {
		const firstPlaceholder = adPlaceholders[0];

		const adDiv = firstPlaceholder.firstElementChild;

		return !!adDiv;
	}
}
