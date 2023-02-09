import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
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
		adPlaceholders.forEach((placeholder) => {
			const adWrapper = placeholder.firstElementChild;

			if (!adWrapper) {
				return;
			}

			const adSlotName = adWrapper.getAttribute('data-ad');
			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});
	}

	// TODO: This is temporary workaround. Change it for the proper event informing that ad placeholders
	//  are ready to inject the ad slots (event should be ready after RV code freeze is over).
	private adDivsReady(adPlaceholders) {
		const firstPlaceholder = adPlaceholders[0];
		const adDiv = firstPlaceholder.firstElementChild;

		return !!adDiv;
	}
}
