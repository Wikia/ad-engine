import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	utils,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class StickyTlbBootstrapHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'sticky'>): Promise<void> {
		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		transition('sticky');
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}
	}
}
