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
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable()
export class BfabBootstrapHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		private manipulator: DomManipulator,
	) {}

	async onEnter(transition: TemplateTransition<'resolved' | 'impact'>): Promise<void> {
		this.adSlot.addClass('expanded-slot');
		this.adSlot.getAdContainer().classList.add('iframe-container');
		this.manipulator.element(this.adSlot.getElement()).setProperty('visibility', 'hidden');

		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		if (resolvedState.isResolvedState(this.params)) {
			transition('resolved');
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
		this.manipulator.restore();
	}
}
