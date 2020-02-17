import {
	AdSlot,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BfaaBootstrapHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.hide();
		universalAdPackage.init(this.params, ['top_boxad'], []); // TODO: refactor
		this.adSlot.getElement().style.setProperty('backgroundColor', '#000');
		this.adSlot.getElement().classList.add('bfaa-template');

		// TODO: make decision for resolved/impact
		transition('resolved');
	}

	private moveNavbar(offset: number, time: number): void {
		const navbarElement: HTMLElement = document.querySelector('.wds-global-navigation-wrapper');

		if (navbarElement) {
			navbarElement.style.transition = offset
				? ''
				: `top ${time}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`;
			navbarElement.style.top = offset ? `${offset}px` : '';
		}
	}

	async onLeave(): Promise<void> {}
}
