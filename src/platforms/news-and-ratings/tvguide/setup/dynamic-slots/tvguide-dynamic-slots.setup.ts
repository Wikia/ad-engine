import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	slotService,
	targetingService,
	utils,
} from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	private PLACEMENT_SELECTOR = '.c-adDisplay';
	private pushedSlots = [];

	execute(): void {
		const waitForInstance = new utils.WaitFor(() => this.injectSlotsIntoPlacements(), 10, 200);

		communicationService.on(
			eventsRepository.AD_ENGINE_PARTNERS_READY,
			() => {
				this.pushedSlots = [];
				waitForInstance.reset();
				waitForInstance.until().then(() => utils.logger('setup', 'slot injection finished'));
			},
			false,
		);
	}

	private injectSlotsIntoPlacements(): boolean {
		const adPlacements = document.querySelectorAll(this.PLACEMENT_SELECTOR);

		if (!adPlacements) {
			return false;
		}

		this.injectSlots(adPlacements);

		return false;
	}

	private injectSlots(adPlacements): void {
		adPlacements.forEach((placement) => {
			const adSlotName = placement.getAttribute('data-ad');

			if (!this.isSlotDefinedInContext(adSlotName)) {
				utils.logger('setup', 'Slot not defined in the context', adSlotName);
				return;
			}

			if (this.pushedSlots.includes(adSlotName)) {
				utils.logger('setup', 'Slot already pushed', adSlotName, this.pushedSlots);
				return;
			}

			if (context.get(`slots.${adSlotName}.repeat`)) {
				this.setupRepeatableSlot(adSlotName);
			}

			this.pushedSlots.push(adSlotName);
			placement.id = adSlotName;

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
		const slotId = slotNameBase || slotName;
		const nextSlotName = `${slotId}-${nextIndex}`;
		const nextSlotPlace = document.querySelector(
			`div[data-ad="${slotNameBase || slotName}"]:not(.gpt-ad)`,
		);

		if (!nextSlotPlace) {
			return;
		}

		this.setupRepeatableSlot(nextSlotName, slotId);
		nextSlotPlace.id = nextSlotName;

		const basePosNr = targetingService.get('pos_nr', slotId);
		targetingService.set('pos_nr', basePosNr, nextSlotName);
		context.push('state.adStack', { id: nextSlotName });
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}
}
