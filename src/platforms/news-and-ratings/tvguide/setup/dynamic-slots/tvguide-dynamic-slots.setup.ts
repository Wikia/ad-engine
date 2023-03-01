import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	slotService,
	utils,
} from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	execute(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_PARTNERS_READY,
			() => {
				const adPlaceholders = document.querySelectorAll('.c-adDisplay_container');

				if (!adPlaceholders) {
					return;
				}

				new utils.WaitFor(() => this.adDivsReady(adPlaceholders), 10, 100)
					.until()
					.then(() => this.injectSlots(adPlaceholders));
			},
			false,
		);
	}

	private injectSlots(adPlaceholders): void {
		const pushedSlots = [];

		adPlaceholders.forEach((placeholder) => {
			const adWrapper = placeholder.firstElementChild;

			if (!adWrapper) {
				utils.logger('setup', 'No ad wrapper found for potential ad slot', placeholder);
				return;
			}

			const adSlotName = adWrapper.getAttribute('data-ad');

			if (!this.isSlotDefinedInContext(adSlotName)) {
				utils.logger('setup', 'Slot not defined in the context', adSlotName);
				return;
			}

			if (pushedSlots.includes(adSlotName)) {
				utils.logger('setup', 'Slot already pushed', adSlotName, pushedSlots);
				return;
			}

			if (context.get(`slots.${adSlotName}.repeat`)) {
				this.setupRepeatableSlot(adSlotName);
			}

			pushedSlots.push(adSlotName);
			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});
	}

	private setupRepeatableSlot(slotName, slotNameBase = '') {
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => this.injectNextSlot(slotName, slotNameBase),
			slotName,
			true,
		);
		communicationService.onSlotEvent(
			AdSlot.STATUS_COLLAPSE,
			() => this.injectNextSlot(slotName, slotNameBase),
			slotName,
			true,
		);
	}

	private injectNextSlot(slotName, slotNameBase = '') {
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
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	private adDivsReady(adPlaceholders) {
		const firstPlaceholder = adPlaceholders[0];
		const adDiv = firstPlaceholder.firstElementChild;

		return !!adDiv;
	}
}
