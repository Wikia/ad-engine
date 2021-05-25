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
export class BfaaNewBootstrapHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	async onEnter(transition: TemplateTransition<'embeddedSmall' | 'embeddedBig'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.hide();
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('bfaa-template');
		this.adSlot.addClass('slot-responsive');
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.adSlot.getAdContainer().classList.add('iframe-container');
		this.ensureImage();

		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		if (resolvedState.isResolvedState(this.params)) {
			transition('embeddedSmall');
		} else {
			resolvedState.updateInformationAboutSeenDefaultStateAd();
			transition('embeddedBig');
		}
	}

	private ensureImage(): void {
		if (!(this.params.image2 && this.params.image2.background)) {
			this.params.image1.element.classList.remove('hidden-state');
		}
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
		document.body.classList.add('has-new-uap');
	}

	async onDestroy(): Promise<void> {
		document.body.classList.remove('has-new-uap');
	}
}
