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

	async onEnter(transition: TemplateTransition<'display'>): Promise<void> {
		this.adSlot.hide();
		this.adSlot.addClass('interstitial');
		this.adSlot.addClass('out-of-page-template');

		await slotTweaker.adjustIframeByContentSize(this.adSlot);

		transition('display');
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
	}
}
