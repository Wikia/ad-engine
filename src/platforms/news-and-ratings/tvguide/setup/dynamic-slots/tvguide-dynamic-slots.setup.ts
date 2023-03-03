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
	private PLACEHOLDER_SELECTOR = '.c-adDisplay_container';

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
		const adPlaceholders = document.querySelectorAll(this.PLACEHOLDER_SELECTOR);

		if (!adPlaceholders) {
			return;
		}

		new utils.WaitFor(() => this.adDivsReady(adPlaceholders), 10, 100)
			.until()
			.then(() => this.injectSlots(adPlaceholders));
	}

	private injectListingSlots() {
		this.PLACEHOLDER_SELECTOR = '.c-tvListingsSchedule_adRow';

		new utils.WaitFor(
			() => document.querySelectorAll(this.PLACEHOLDER_SELECTOR)?.length > 0,
			10,
			100,
		)
			.until()
			.then(() => this.injectSlots(document.querySelectorAll(this.PLACEHOLDER_SELECTOR)))
			.then(() => (this.PLACEHOLDER_SELECTOR = '.c-adDisplay_container'));
	}

	private injectSlots(adPlaceholders): Promise<void> {
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

		return Promise.resolve();
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
			`${this.PLACEHOLDER_SELECTOR} > div[data-ad="${slotNameBase || slotName}"]:not(.gpt-ad)`,
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

	private isListingsPageType(): boolean {
		return window.utag_data?.pageType === 'listings';
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	private adDivsReady(adPlaceholders) {
		const firstPlaceholder = adPlaceholders[0];
		const adDiv = firstPlaceholder.firstElementChild;

		return !!adDiv;
	}
}
