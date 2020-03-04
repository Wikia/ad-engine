import {
	AdSlot,
	AdvertisementLabel,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class AdvertisementLabelHandler implements TemplateStateHandler {
	private advertisementLabel: HTMLDivElement;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	async onEnter(): Promise<void> {
		this.advertisementLabel = new AdvertisementLabel({
			isDarkTheme: this.params.isDarkTheme,
		}).render();

		this.adSlot.getElement().appendChild(this.advertisementLabel);
	}

	async onLeave(): Promise<void> {}
}
