import { timeouts } from './timeouts';

class AdSlots {
	constructor() {
		this.topLeaderboard = '#top_leaderboard';
		this.bottomLeaderboard = '#bottom_leaderboard';
		this.topBoxad = '#top_boxad';
		this.incontentBoxad = '#incontent_boxad';
		this.injectedBoxad = '#injected_boxad';
		this.incontentPlayer = '#incontent_player';
		this.invisibleHighImpact = '#invisible_high_impact_2';

		this.resultAttribute = 'data-slot-result';
		this.viewedAttribute = 'data-slot-viewed';
		this.adViewed = 'true';
		this.adCollapsed = 'collapse';
	}

	waitForSlotCollapsed(adSlot) {
		browser.waitUntil(
			() => $(adSlot).getAttribute(this.resultAttribute) === this.adCollapsed,
			timeouts.standard,
			'Slot did not collapse',
			timeouts.interval,
		);
	}

	waitForSlotViewed(adSlot) {
		browser.waitUntil(
			() => $(adSlot).getAttribute(this.viewedAttribute) === this.adViewed,
			timeouts.standard,
			'Slot has not been viewed',
			timeouts.interval,
		);
	}
}

export const adSlots = new AdSlots();
