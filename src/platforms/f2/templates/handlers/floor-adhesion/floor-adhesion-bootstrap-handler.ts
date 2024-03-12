import {
	AdSlotClass,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	type AdSlot,
} from '@ad-engine/core';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class FloorAdhesionBootstrapHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'display'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass(AdSlotClass.HIDDEN_AD_CLASS);
		this.adSlot.addClass('floor-adhesion');
		this.adSlot.addClass('out-of-page-template');

		if (this.adSlot.isOutOfPage()) {
			await slotTweaker.adjustIframeByContentSize(this.adSlot);
		}

		transition('display');
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
	}
}
