import { AdSlot, AdvertisementLabel, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AdvertisementLabelHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		const advertisementLabel = new AdvertisementLabel();

		this.adSlot.getElement().appendChild(advertisementLabel.render());
	}
}
