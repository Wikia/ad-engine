import {
	AdSlot,
	communicationService,
	eventsRepository,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InterstitialBootstrapHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'display'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass('interstitial');
		this.adSlot.addClass('out-of-page-template');

		if (this.adSlot.isOutOfPage()) {
			await slotTweaker.adjustIframeByContentSize(this.adSlot);
		}

		window.ads.runtime.interstitial = window.ads.runtime.interstitial || {};
		window.ads.runtime.interstitial.available = true;

		transition('display');
	}

	async onLeave(): Promise<void> {
		communicationService.emit(eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED);
		this.adSlot.show();

		window.ads.runtime.interstitial.visible = true;
	}
}
