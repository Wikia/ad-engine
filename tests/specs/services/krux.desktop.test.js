import { expect } from 'chai';
import { krux } from '../../pages/krux.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { adSlots } from '../../common/ad-slots';

describe('It will test krux page', () => {
	it('will test if cached value is stored', () => {
		browser.url(krux.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
		helpers.waitForViewabillityCounted();

		browser.refresh();
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		expect(krux.getUserID()).to.not.be.empty;
		expect(krux.getSegments()).to.not.be.empty;
	});

	it('will test disabled krux', () => {
		helpers.navigateToUrl(krux.pageLink, queryStrings.getKrux(false));
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
		helpers.waitForViewabillityCounted();

		browser.refresh();
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
	});

	it('will test disabled tracking', () => {
		helpers.navigateToUrl(krux.pageLink, queryStrings.getTrackingOptIn(false));
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
		helpers.waitForViewabillityCounted();

		browser.refresh();
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
	});
});
