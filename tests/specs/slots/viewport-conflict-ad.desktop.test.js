import { expect } from 'chai';
import { viewportConflictAd } from '../../pages/viewport-conflict-ad.page';
import { adSlots } from '../../common/ad-slots';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';

describe('Viewport conflict ads page: top boxad', () => {
	before(() => {
		browser.url(viewportConflictAd.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if top boxad is hidden after clicking the button', () => {
		$(viewportConflictAd.hideBoxadButton).waitForDisplayed(timeouts.standard);
		$(viewportConflictAd.hideBoxadButton).click();
		adSlots.waitForSlotResult(adSlots.topBoxad, adSlots.adCollapsed);
		expect($(`${adSlots.topBoxad}${helpers.classHidden}`).isExisting()).to.be.true;
		expect($(adSlots.topBoxad).isDisplayedInViewport()).to.be.false;
	});
});

describe('Viewport conflict ads page: bottom leaderboard', () => {
	beforeEach(() => {
		browser.url(viewportConflictAd.pageLink);
	});

	it('Check if slot is visible in viewport', () => {
		$(viewportConflictAd.hideBoxadButton).waitForDisplayed(timeouts.standard);
		$(viewportConflictAd.addParagraphButton).waitForDisplayed(timeouts.standard);
		$(viewportConflictAd.hideBoxadButton).click();
		viewportConflictAd.addParagraphs(5);
		helpers.slowScroll(2800);
		adSlots.waitForSlotResult(adSlots.bottomLeaderboard, adSlots.adLoaded);
		expect($(adSlots.bottomLeaderboard).isDisplayedInViewport()).to.be.true;
	});
});
