import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class FloorAdhesionBootstrapHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'display'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass(AdSlot.HIDDEN_CLASS);
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
