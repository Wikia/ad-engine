import { AdSlot, TEMPLATE, TemplateStateHandler } from '@ad-engine/core';
import { AdvertisementLabel } from '@wikia/ad-products';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class AdvertisementLabelHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		const adSlotElement = this.adSlot.getElement();
		const advertisementLabel = adSlotElement.querySelector('.advertisement-label');
		if (advertisementLabel) {
			return;
		}

		const newAdvertisementLabel = new AdvertisementLabel();
		adSlotElement.appendChild(newAdvertisementLabel.render());
	}
}
