import { expect } from 'chai';
import { moat } from '../../pages/moat.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { adSlots } from '../../common/ad-slots';

describe('It will test moat page', () => {
	it('will test if cached value is stored', () => {
		browser.url(moat.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
		expect(moat.getPageLevelParams()).to.equal(
			'{"m_safety":"safe","m_categories":["moat_safe"],"m_data":"0"}',
		);
	});

	it('will test disabled moat', () => {
		helpers.navigateToUrl(moat.pageLink, queryStrings.getMoat(false));
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted();
		expect(moat.getPageLevelParams()).to.include('Waiting');
	});

	it('will test delayed moat', () => {
		helpers.navigateToUrl(moat.pageLink, queryStrings.getAdEngineDelay(1000));
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted();
		helpers.waitForValuesLoaded();
		expect(moat.getPageLevelParams()).to.equal(
			'{"m_safety":"safe","m_categories":["moat_safe"],"m_data":"0"}',
		);
	});
});
