import { expect } from 'chai';
import { krux } from '../../pages/krux.page';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { slots } from '../../common/slot-registry';

describe('It will test krux page', () => {
	it('will test if cached value is stored', () => {
		helpers.navigateToUrl(krux.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
		helpers.waitForViewabillityCounted();

		browser.refresh();
		slots.topLeaderboard.waitForDisplayed();
		expect(krux.getUserID()).to.not.be.empty;
		expect(krux.getSegments()).to.not.be.empty;
	});

	it('will test disabled krux', () => {
		helpers.navigateToUrl(krux.pageLink, queryStrings.getKrux(false));
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
		helpers.waitForViewabillityCounted();

		browser.refresh();
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
	});

	it('will test disabled tracking', () => {
		helpers.navigateToUrl(krux.pageLink, queryStrings.getTrackingOptIn(false));
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
		helpers.waitForViewabillityCounted();

		browser.refresh();
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForValuesLoaded();
		expect(krux.getUserID()).to.be.empty;
		expect(krux.getSegments()).to.be.empty;
	});
});
