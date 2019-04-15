import { adSlots } from '../common/ad-slots';
import { timeouts } from '../common/timeouts';

const scrollWaitTime = 500;

class AnimationsAd {
	constructor() {
		this.pageLink = 'slots/animations/';
		this.topLeaderboardHeightWhenHidden = 0;
		this.topLeaderboardStyle = 'style';
		this.collapsedAdMaxHeight = 'max-height: 0px;';
		// currently added only for animations ad, as top leaderboard hides after 6 seconds
		this.waitForAnimationsTime = 10000;
	}

	/**
	 * Pauses everything so animation can finish its action.
	 */
	waitToScroll() {
		browser.pause(scrollWaitTime);
	}

	waitUntilCollapsed() {
		browser.waitUntil(
			() => {
				const leaderboardStyle = $(adSlots.topLeaderboard).getAttribute(this.topLeaderboardStyle);

				return leaderboardStyle === this.collapsedAdMaxHeight;
			},
			this.waitForAnimationsTime,
			'Top leaderboard ad did not collapse',
			timeouts.interval,
		);
	}
}

export const animationsAd = new AnimationsAd();
