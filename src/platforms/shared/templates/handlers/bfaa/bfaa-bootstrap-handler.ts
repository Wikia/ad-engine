// @ts-strict-ignore
import {
	AdSlot,
	resolvedState,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaBootstrapHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	async onEnter(transition: TemplateTransition<'sticky' | 'impact'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('bfaa-template');
		this.adSlot.addClass('slot-responsive');
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.adSlot.getAdContainer().classList.add('iframe-container');

		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		if (resolvedState.isResolvedState(this.params)) {
			transition('sticky');
		} else {
			resolvedState.updateInformationAboutSeenDefaultStateAd();
			transition('impact');
		}
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
		document.body.classList.add('has-uap');
	}

	async onDestroy(): Promise<void> {
		document.body.classList.remove('has-uap');
	}
}
