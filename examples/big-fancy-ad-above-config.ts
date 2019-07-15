import { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } from '@wikia/ad-engine';

export const getConfig = () => ({
	moveNavbar(offset: number, time: number = SLIDE_OUT_TIME) {
		const navbarElement: HTMLElement = document.querySelector('body > nav.navigation');

		if (navbarElement) {
			navbarElement.style.transition = offset ? '' : `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
			navbarElement.style.top = offset ? `${offset}px` : '';
		}
	},
	onAfterUnstickBfaaCallback() {
		this.moveNavbar(0, 0);
	},
});
