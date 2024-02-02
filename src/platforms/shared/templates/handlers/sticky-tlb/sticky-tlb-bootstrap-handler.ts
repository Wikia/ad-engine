import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@ad-engine/core';
import { once } from '@ad-engine/utils';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyTlbBootstrapHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'sticky'>): Promise<void> {
		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		transition('sticky');
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await once(window, 'visibilitychange');
		}
	}
}
