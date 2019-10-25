import { expect } from 'chai';
import { delayAd } from '../../pages/delay-ad.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { slots } from '../../common/slot-registry';

describe('Before load', () => {
	before(() => {
		helpers.navigateToUrl(delayAd.pageLink);
		$(delayAd.loadAdsButton).waitForDisplayed(timeouts.standard);
	});

	it('Check if top leaderboard is not immediately visible', () => {
		expect(slots.topLeaderboard.hasChildren()).to.be.false;
	});

	it('Check if top boxad is not immediately visible', () => {
		expect(slots.topBoxad.hasChildren()).to.be.false;
	});
});

describe('Loaded with click', () => {
	before(() => {
		helpers.navigateToUrl(delayAd.pageLink);
		delayAd.loadAds();
	});

	it('top leaderboard is loaded after clicking the button', () => {
		slots.topLeaderboard.waitForSlotViewed();
		expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		expect(slots.topLeaderboard.getAttribute(delayAd.resultAttribute)).to.equal(
			delayAd.adLoaded,
			'Top leaderboard slot failed to load',
		);
		expect(slots.topLeaderboard.getAttribute(delayAd.viewedAttribute)).to.equal(
			delayAd.adViewed,
			'Top leaderboard slot has not been counted as viewed',
		);
	});

	it('top boxad is loaded after clicking the button', () => {
		slots.topBoxad.waitForDisplayed();
		slots.topBoxad.waitForSlotViewed();
		expect(slots.topBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		expect(slots.topBoxad.getAttribute(delayAd.resultAttribute)).to.equal(
			delayAd.adLoaded,
			'Top boxad slot failed to load',
		);
		expect(slots.topBoxad.getAttribute(delayAd.viewedAttribute)).to.equal(
			delayAd.adViewed,
			'Top boxad slot has not been counted as viewed',
		);
	});
});

describe('After delay', () => {
	before(() => {
		helpers.navigateToUrl(delayAd.pageLink);
		delayAd.waitToLoadAds();
	});

	it('Check if top leaderboard is visible in viewport after delay', () => {
		expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if top boxad is visible in viewport after delay', () => {
		expect(slots.topBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});
});
