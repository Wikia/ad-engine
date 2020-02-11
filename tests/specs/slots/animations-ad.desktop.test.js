import { expect } from 'chai';
import { animationsAd } from '../../pages/animations-ad.page';
import { slots } from '../../common/slot-registry';
import { helpers } from '../../common/helpers';

describe('Animations ad page: top leaderboard', () => {
	before(() => {
		helpers.navigateToUrl(animationsAd.pageLink);
		slots.topLeaderboard.waitForDisplayed();
	});

	it('Check if top leaderboard disappears after 6 seconds', () => {
		animationsAd.waitUntilCollapsed();
		helpers.waitForAnimations();

		expect(slots.topLeaderboard.size.height).to.equal(
			animationsAd.topLeaderboardHeightWhenHidden,
			'Top leaderboard was not hidden',
		);
	});
});
