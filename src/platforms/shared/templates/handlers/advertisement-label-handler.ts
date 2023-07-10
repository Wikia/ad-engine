import { AdSlot, AdvertisementLabel, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AdvertisementLabelHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

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
