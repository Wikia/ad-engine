import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@ad-engine/core';
import { logger, once } from '@ad-engine/utils';
import { resolvedState, UapParams } from '@wikia/ad-products';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfabBootstrapHandler implements TemplateStateHandler {
	static LOG_GROUP = 'BfabBootstrapHandler';

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	private logger = (...args: any[]) => logger(BfabBootstrapHandler.LOG_GROUP, ...args);

	async onEnter(transition: TemplateTransition<'resolved' | 'impact'>): Promise<void> {
		this.logger('onEnter', this.params);

		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('bfab-template');
		this.adSlot.getAdContainer().classList.add('iframe-container');
		this.ensureImage();

		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		if (resolvedState.isResolvedState(this.params)) {
			transition('resolved');
		} else {
			resolvedState.updateInformationAboutSeenDefaultStateAd();
			transition('impact');
		}
	}

	private ensureImage(): void {
		this.logger('ensureImage', this.params.image1, this.params.image2);

		if (!(this.params.image2 && this.params.image2.background)) {
			this.params.image1.element.classList.remove('hidden-state');
		}
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await once(window, 'visibilitychange');
		}
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
	}
}
