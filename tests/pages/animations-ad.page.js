import { timeouts } from '../common/timeouts';
import { slots } from '../common/slot-registry';

class AnimationsAd {
	constructor() {
		this.pageLink = 'slots/animations/';
		this.topLeaderboardHeightWhenHidden = 0;
		// currently added only for animations ad, as top leaderboard hides after 6 seconds
		this.waitForAnimationsTime = 8000;
	}

	waitUntilCollapsed() {
		browser.waitUntil(
			() => slots.topLeaderboard.size.height === 0,
			this.waitForAnimationsTime,
			'Top leaderboard ad did not collapse',
			timeouts.interval,
		);
	}
}

export const animationsAd = new AnimationsAd();
