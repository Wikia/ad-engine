import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BfaaBootstrapHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	async onEnter(
		transition: TemplateTransition<'resolved' | 'sticky' | 'impact' | 'transition'>,
	): Promise<void> {
		// TODO: remove
		window['transition'] = (state: any) => transition(state, { allowMulticast: true });

		universalAdPackage.init(this.params, ['top_boxad'], []); // TODO: refactor
		document.body.classList.add('has-bfaa');
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.hide();
		this.adSlot.getElement().style.setProperty('backgroundColor', '#000');
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('bfaa-template');
		this.ensureImage();

		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		// TODO: make decision for sticky/impact
		transition('transition');
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

	async onLeave(): Promise<void> {}
}
