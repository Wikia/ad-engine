import {
	AdSlot,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { setResolvedImagesInAd } from '../helpers/set-images';

// function moveNavbar(offset, time) {
// 	const navbarElement: HTMLElement = document.querySelector('.wds-global-navigation-wrapper');

// 	if (navbarElement) {
// 		navbarElement.style.transition = offset
// 			? ''
// 			: `top ${time}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`;
// 		navbarElement.style.top = offset ? `${offset}px` : '';
// 	}
// }

@Injectable()
export class BfaaStickyHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		const aspectRatios = this.params.config.aspectRatio;
		const iframe = await slotTweaker.onReady(this.adSlot);

		document.body.style.paddingTop = `${aspectRatios.resolved}vw`;
		slotTweaker.setPaddingBottom(iframe, aspectRatios.resolved);
		setResolvedImagesInAd(this.adSlot, this.params);
	}

	async onLeave(): Promise<void> {}
}
