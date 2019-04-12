import { expect } from 'chai';
import { floatingRailAd } from '../../../pages/floating-rail-ad.page';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { adSlots } from '../../../common/ad-slots';
import networkCapture from '../../../common/network-capture';

// TODO Fix floating rail
xdescribe('Floating rail ads page: floating rail', () => {
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
	xit('Check visual regression in top boxad', () => {
		helpers.checkVisualRegression(browser.checkElement(adSlots.topBoxad));
	});
});

// TODO Network
xdescribe('Floating rail ads page: top boxad requests', () => {
	let fetchedUrl;
	const gatheredUrls = [];
	let i = 0;
	let client;

	before(async () => {
		client = await networkCapture.getClient();
		const pattern = RegExp(adSlots.floatingRailTopBoxadRequestPattern);

		client.on('Network.responseReceived', (params) => {
			const { url } = params.response;

			if (pattern.test(url)) {
				fetchedUrl = url.replace(adSlots.floatingRailTopBoxadReplaceRegexp, '');
				gatheredUrls[i] = fetchedUrl;
				i += 1;
			}
		});
		await browser.url(floatingRailAd.pageLink);
		await $(adSlots.railModule).waitForDisplayed(timeouts.standard);
		await browser.pause(timeouts.viewabillity);
	});

	after(() => {
		networkCapture.closeClient(client);
	});

	it('Check position of the slot', () => {
		expect(gatheredUrls[0]).to.include('pos%3Dtop_boxad');
	});

	it('Check if ad is not from UAP', () => {
		expect(gatheredUrls[0]).to.include('uap%3Dnone');
	});

	it('Check slot size in response', () => {
		expect(gatheredUrls[0]).to.include('prev_iu_szs=300x250');
	});

	it('Check positioning of the slot', () => {
		expect(gatheredUrls[0]).to.include('prev_scp=loc%3Dtop');
	});
});
