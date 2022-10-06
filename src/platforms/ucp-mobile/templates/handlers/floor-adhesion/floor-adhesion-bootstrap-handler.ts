import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class FloorAdhesionBootstrapHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'display'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass(AdSlot.HIDDEN_CLASS);

		if (this.adSlot.isOutOfPage()) {
			await slotTweaker.adjustIframeByContentSize(this.adSlot);
		}
		transition('display');
	}

	async onLeave(): Promise<void> {
		document.getElementById('floor_adhesion_anchor').classList.remove('hide');
		this.adSlot.show();
	}
}
