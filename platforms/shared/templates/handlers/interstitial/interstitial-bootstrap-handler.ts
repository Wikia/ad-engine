import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class InterstitialBootstrapHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'listen'>): Promise<void> {
		this.adSlot.hide();
		this.adSlot.addClass('interstitial');
		this.adSlot.addClass('out-of-page-template');

		if (this.adSlot.isOutOfPage()) {
			await slotTweaker.adjustIframeByContentSize(this.adSlot);
		}

		if (window.location.hash === '#interstitial') {
			window.location.hash = '';
		}

		window.ads.runtime.interstitial = window.ads.runtime.interstitial || {};

		transition('listen');
	}

	async onLeave(): Promise<void> {}
}
