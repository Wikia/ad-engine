import { expect } from 'chai';
import { floatingRailAd } from '../../../pages/floating-rail-ad.page';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { adSlots } from '../../../common/ad-slots';
import { network } from '../../../common/network';
import { commonAds } from '../../../pages/common-ad.page';

// TODO Fix floating rail
describe.skip('Floating rail ads page: floating rail', () => {
	before(() => {
		browser.url(floatingRailAd.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if rail scrolls with the content', () => {
		helpers.slowScroll(500);
		expect($(floatingRailAd.rail).getAttribute(helpers.classProperty)).to.equal(
			floatingRailAd.attributeRailScrolling,
			'Rail did not scroll',
		);
		expect($(floatingRailAd.rail).isDisplayedInViewport(), 'Rail not in viewport').to.be.true;
	});

	// TODO Visual
	it.skip('Check visual regression in top boxad', () => {
		helpers.checkVisualRegression(browser.checkElement(adSlots.topBoxad));
	});
});

describe('Floating rail ads page: top boxad requests', () => {
	let fetchedUrl;
	let i = 0;

	before(() => {
		network.enableCapturing('ads?');
		network.clearResponses();

		browser.url(floatingRailAd.pageLink);
		$(commonAds.railModule).waitForDisplayed(timeouts.standard);
		browser.pause(timeouts.viewabillity);
	});

	after(() => {
		network.disableCapturing();
	});

	describe('Turn on capturing', () => {
		before(() => {
			network.waitForResponse('top_boxad');
		});

		it('Check position of the slot', () => {
			expect(network.checkIfHasResponse(encodeURIComponent(`pos=top_boxad`))).to.be.true;
		});

		it('Check if ad is not from UAP', () => {
			expect(network.checkIfHasResponse(encodeURIComponent(`uap=none`))).to.be.true;
		});

		it('Check slot size in response', () => {
			expect(network.checkIfHasResponse(`&sz=300x250`)).to.be.true;
		});

		it('Check positioning of the slot', () => {
			expect(network.checkIfHasResponse(`scp=loc%3Dtop`)).to.be.true;
		});
	});
});
