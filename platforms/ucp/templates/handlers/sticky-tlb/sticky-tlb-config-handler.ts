import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyTlbConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'sticky'>): Promise<void> {
		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		document.body.classList.add('has-bfaa');
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('sticky-tlb');
		this.adSlot.getAdContainer().classList.add('iframe-centered');

		transition('sticky');
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
	}
}
