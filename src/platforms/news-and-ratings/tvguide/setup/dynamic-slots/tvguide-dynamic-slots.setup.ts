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
				this.injectStandardSlots();

				if (this.isListingsPageType()) {
					this.injectListingSlots();
				}
			},
			false,
		);
	}

	private injectStandardSlots() {
		const selector = '.c-adDisplay_container';

		new utils.WaitFor(() => this.adDivsReady(selector), 10, 100)
			.until()
			.then(() => this.injectSlots(selector));
	}

	private injectListingSlots() {
		const selector = '.c-tvListingsSchedule_adRow';

		new utils.WaitFor(() => this.adDivsReady(selector), 10, 100)
			.until()
			.then(() => this.injectSlots(selector));
	}

	private injectSlots(placeholderSelector): void {
		const adPlaceholders = document.querySelectorAll(placeholderSelector);
		const pushedSlots = [];

		adPlaceholders.forEach((placeholder) => {
			const adWrapper = placeholder?.firstElementChild;

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
				this.setupRepeatableSlot(adSlotName, placeholderSelector);
			}

			pushedSlots.push(adSlotName);
			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});
	}

	private setupRepeatableSlot(slotName, placeholderSelector, slotNameBase = '') {
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => this.injectNextSlot(slotName, placeholderSelector, slotNameBase),
			slotName,
			true,
		);
		communicationService.onSlotEvent(
			AdSlot.STATUS_COLLAPSE,
			() => this.injectNextSlot(slotName, placeholderSelector, slotNameBase),
			slotName,
			true,
		);
	}

	private injectNextSlot(slotName, placeholderSelector, slotNameBase = '') {
		const adSlot = slotService.get(slotName);
		if (!adSlot) {
			return;
		}

		const nextIndex = adSlot.getConfigProperty('repeat.index') + 1;
		const nextSlotName = `${slotNameBase || slotName}-${nextIndex}`;
		const nextSlotPlace = document.querySelector(
			`${placeholderSelector} > div[data-ad="${slotNameBase || slotName}"]:not(.gpt-ad)`,
		);

		if (!nextSlotPlace) {
			return;
		}

		this.setupRepeatableSlot(nextSlotName, placeholderSelector, slotNameBase || slotName);
		nextSlotPlace.id = nextSlotName;
		context.push('state.adStack', { id: nextSlotName });
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}

	private isListingsPageType(): boolean {
		return window.utag_data?.pageType === 'listings';
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	private adDivsReady(selector) {
		const adPlaceholders = document.querySelectorAll(selector);

		if (!adPlaceholders) {
			return false;
		}

		const firstPlaceholder = adPlaceholders[0];
		const adDiv = firstPlaceholder?.firstElementChild;

		return !!adDiv;
	}
}
