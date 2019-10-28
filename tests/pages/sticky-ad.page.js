import { slots } from '../common/slot-registry';

class StickyAd {
	constructor() {
		this.pageLink = 'templates/sticky-ad/';
		this.classStickyTemplate = '.sticky-template';
		this.classStickySlot = '.sticky-slot';
		this.classUnstickButton = '.button-unstick';
		this.stickedSlot = `${slots.topLeaderboard.selector}${this.classStickyTemplate}${
			this.classStickySlot
		}`;
	}
}

export const stickyAd = new StickyAd();
