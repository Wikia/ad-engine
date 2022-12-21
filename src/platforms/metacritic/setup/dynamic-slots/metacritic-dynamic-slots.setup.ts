import { context, DiProcess } from '@wikia/ad-engine';

export class MetacriticDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.ad_unit');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotName = placeholder.id;

			context.push('state.adStack', { id: adSlotName });
		});
	}
}
