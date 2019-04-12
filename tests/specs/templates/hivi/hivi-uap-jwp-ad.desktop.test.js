import { expect } from 'chai';
import { hiviUapJwp } from '../../../pages/hivi-uap-jwp-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('Desktop HiVi UAP JWP ads page: top leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUapJwp.pageLink);
		$(hiviUapJwp.loadAdsButton).waitForDisplayed(timeouts.standard);
	});

	it('Check if slot is existing, but the ad is not immediately visible', () => {
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		expect(
			$(`${adSlots.topLeaderboard}${adSlots.resultAttribute}`).isExisting(),
			'Top leaderboard visible',
		).to.be.false;
	});

	it('Check if top leaderboard does not load after manually finishing the queue', () => {
		$(hiviUapJwp.loadAdsButton).click();
		$(hiviUapJwp.staticFrame).waitForExist(timeouts.standard);
		expect($(adSlots.lineItemIdAttribute).isExisting(), 'Top leaderboard has been loaded').to.be
			.false;
	});
});

describe('Desktop HiVi UAP JWP ads page: top boxad (ads loaded after 10s)', () => {
	beforeEach(() => {
		browser.url(hiviUapJwp.pageLink);
		$(hiviUapJwp.loadAdsButton).waitForDisplayed(timeouts.standard);
	});

	it('Check if top boxad is existing, but not immediately visible', () => {
		expect($(`${adSlots.topBoxad}${adSlots.resultAttribute}`).isExisting(), 'Top boxad visible').to
			.be.false;
	});

	it('Check if the ad loaded after delay is visible and if it is the inhouse one', () => {
		hiviUapJwp.waitToLoadAds();
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect($(adSlots.topBoxad).isDisplayedInViewport(), 'Slot not in viewport').to.be.true;
	});

	it('Check if the loaded ad is the inhouse one', () => {
		hiviUapJwp.waitToLoadAds();
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect($(adSlots.topBoxad).getAttribute(adSlots.lineItemIdAttribute)).to.equal(
			hiviUapJwp.inHouseLineItemId,
			'Wrong ad loaded',
		);
	});

	// TODO Visual
	xit('Check visual regression in top boxad', () => {
		hiviUapJwp.waitToLoadAds();
		browser.checkElement(adSlots.topBoxad);
	});
});

describe('Desktop HiVi UAP JWP ads page: top boxad (ads loaded after clicking the button)', () => {
	before(() => {
		browser.url(hiviUapJwp.pageLink);
		$(hiviUapJwp.loadAdsButton).waitForDisplayed(timeouts.standard);
		$(hiviUapJwp.loadAdsButton).click();
	});

	it('Check if top boxad shows up after clicking the button', () => {
		expect($(adSlots.topBoxad).isDisplayedInViewport(), 'Slot not in viewport').to.be.true;
	});

	it('Check if slot was viewed', () => {
		adSlots.waitForSlotViewed(adSlots.topBoxad);
		expect($(adSlots.topBoxad).getAttribute(adSlots.resultAttribute)).to.equal(
			adSlots.adLoaded,
			'Top boxad slot failed to load',
		);
	});

	it('Check if slot has UAP ad line item ID', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect($(adSlots.topBoxad).getAttribute(adSlots.lineItemIdAttribute)).to.equal(
			hiviUapJwp.uapLineItemId,
		);
	});

	// TODO Visual
	xit('Check visual regression in top boxad', () => {
		browser.checkElement(adSlots.topBoxad);
	});
});

describe('Desktop HiVi UAP JWP ads page: incontent boxad (ads loaded after 10s)', () => {
	beforeEach(() => {
		helpers.fastScroll(-2000);
		browser.url(hiviUapJwp.pageLink);
	});

	it('Check if slot is existing, but not immediately visible', () => {
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForExist(timeouts.standard);
		expect($(adSlots.incontentBoxad).isDisplayedInViewport(), 'Slot visible in viewport').to.be
			.false;
	});

	it('Check if the ad loaded after delay is the inhouse one', () => {
		hiviUapJwp.waitForAdsAfterDelayAndScrollToAdSlotOnDesktop(adSlots.incontentBoxad);
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect($(adSlots.incontentBoxad).isDisplayedInViewport()).to.be.true;
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapJwp.inHouseLineItemId,
			'Wrong ad loaded',
		);
	});

	// TODO Visual
	xit('Check visual regression in incontent boxad', () => {
		hiviUapJwp.waitForAdsAfterClickAndScrollToAdSlotOnDesktop(adSlots.incontentBoxad);
		browser.checkElement(adSlots.incontentBoxad);
	});
});

describe('Desktop HiVi UAP JWP ads page: incontent boxad (ads loaded after clicking the button)', () => {
	beforeEach(() => {
		helpers.fastScroll(-2000);
		browser.url(hiviUapJwp.pageLink);
		hiviUapJwp.waitForAdsAfterClickAndScrollToAdSlotOnDesktop(adSlots.incontentBoxad);
	});

	it('Check if slot shows up after clicking the button', () => {
		expect($(adSlots.incontentBoxad).isDisplayedInViewport(), 'Incontent boxad not in viewport').to
			.be.true;
	});

	it('Check if slot was viewed', () => {
		adSlots.waitForSlotViewed(adSlots.incontentBoxad);
		expect($(adSlots.incontentBoxad).getAttribute(adSlots.resultAttribute)).to.equal(
			adSlots.adLoaded,
			'Incontent boxad slot failed to load',
		);
	});

	it('Check if slot has UAP ad line item ID', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapJwp.uapLineItemId,
			'Wrong ad loaded',
		);
	});

	// TODO Visual
	xit('Check visual regression in incontent boxad', () => {
		browser.checkElement(adSlots.incontentBoxad);
	});
});
