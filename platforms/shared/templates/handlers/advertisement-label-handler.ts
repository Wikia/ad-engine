import { AdSlot, AdvertisementLabel, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class AdvertisementLabelHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		const advertisementLabel = new AdvertisementLabel();

		this.adSlot.getElement().appendChild(advertisementLabel.render());
	}
}
