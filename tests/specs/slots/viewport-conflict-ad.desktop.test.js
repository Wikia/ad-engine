import { expect } from 'chai';
import { viewportConflictAd } from '../../pages/viewport-conflict-ad.page';
import { slots } from '../../common/slot-registry';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';

describe('Viewport conflict ads page: top boxad', () => {
	before(() => {
		helpers.navigateToUrl(viewportConflictAd.pageLink);
		slots.topBoxad.waitForDisplayed();
	});

	it('Check if top boxad is hidden after clicking the button', () => {
		$(viewportConflictAd.hideBoxadButton).waitForDisplayed(timeouts.standard);
		browser.pause(timeouts.actions);
		$(viewportConflictAd.hideBoxadButton).click();
		slots.topBoxad.waitForSlotCollapsed();
		expect(slots.topBoxad.isDisplayedInViewport()).to.be.false;
	});
});

describe('Viewport conflict ads page: bottom leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(viewportConflictAd.pageLink);
	});

	it('Check if slot is visible in viewport', () => {
		$(viewportConflictAd.hideBoxadButton).waitForDisplayed(timeouts.standard);
		$(viewportConflictAd.addParagraphButton).waitForDisplayed(timeouts.standard);
		$(viewportConflictAd.hideBoxadButton).click();
		viewportConflictAd.addParagraphs(5);
		slots.bottomLeaderboard.scrollIntoView();
		slots.bottomLeaderboard.waitForSlotLoaded();
		expect(slots.bottomLeaderboard.isDisplayedInViewport()).to.be.true;
	});
});
