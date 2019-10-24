import { expect } from 'chai';
import { delayAd } from '../../pages/delay-ad.page';
import { adSlots } from '../../common/ad-slots';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { slots } from '../../common/slot-registry';

describe.only('Delay ads page: top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(delayAd.pageLink);
		$(delayAd.loadAdsButton).waitForDisplayed(timeouts.standard);
	});

	it('Check if slot is not immediately visible', () => {
		expect(slots.topLeaderboard.hasChildren()).to.be.false;
	});

	it('Check if slot is visible in viewport after delay', () => {
		delayAd.waitToLoadAds();
		expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if slot shows up after clicking the button and if it was viewed', () => {
		$(delayAd.loadAdsButton).click();
		slots.topBoxad.waitForDisplayed();
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
});

describe('Delay ads page: top boxad', () => {
	let adStatus;

	beforeEach(() => {
		helpers.navigateToUrl(delayAd.pageLink);
		$(delayAd.loadAdsButton).waitForDisplayed(timeouts.standard);
	});

	it('Check if slot is not immediately visible', () => {
		$(`${adSlots.topBoxad}[${adSlots.resultAttribute}]`).waitForExist(timeouts.standard, true);
	});

	it('Check if slot is visible in viewport after delay', () => {
		delayAd.waitToLoadAds();
		adStatus = slots.topBoxad.status;
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if slot shows up after clicking the button and if it was viewed', () => {
		$(delayAd.loadAdsButton).click();
		adStatus = slots.topBoxad.status;
		adSlots.waitForSlotViewed(adSlots.topBoxad);
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
		expect($(adSlots.topBoxad).getAttribute(adSlots.resultAttribute)).to.equal(
			adSlots.adLoaded,
			'Top boxad slot failed to load',
		);
		expect($(adSlots.topBoxad).getAttribute(adSlots.viewedAttribute)).to.equal(
			adSlots.adViewed,
			'Top boxad slot has not been counted as viewed',
		);
	});
});
