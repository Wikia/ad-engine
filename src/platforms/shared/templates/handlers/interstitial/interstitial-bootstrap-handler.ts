import {
	AdSlot,
	communicationService,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { AD_ENGINE_INTERSTITIAL_DISPLAYED } from "../../../../../communication/events/events-ad-engine";

@Injectable({ autobind: false })
export class InterstitialBootstrapHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

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
		communicationService.emit(AD_ENGINE_INTERSTITIAL_DISPLAYED);
		this.adSlot.show();

		window.ads.runtime.interstitial.visible = true;
	}
}
