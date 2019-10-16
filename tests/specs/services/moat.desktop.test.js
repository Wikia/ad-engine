import { expect } from 'chai';
import { moat } from '../../pages/moat.page';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { slots } from '../../common/slot-registry';

describe('It will test moat page', () => {
	it('will test if cached value is stored', () => {
		helpers.navigateToUrl(moat.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForValuesLoaded();
		expect(moat.getPageLevelParams()).to.equal(
			'{"m_safety":"safe","m_categories":["moat_safe"],"m_data":"0"}',
		);
	});

	it('will test disabled moat', () => {
		helpers.navigateToUrl(moat.pageLink, queryStrings.getMoat(false));
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForViewabillityCounted();
		expect(moat.getPageLevelParams()).to.include('Waiting');
	});

	it('will test delayed moat', () => {
		helpers.navigateToUrl(moat.pageLink, queryStrings.getAdEngineDelay(1000));
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForViewabillityCounted();
		helpers.waitForValuesLoaded();
		expect(moat.getPageLevelParams()).to.equal(
			'{"m_safety":"safe","m_categories":["moat_safe"],"m_data":"0"}',
		);
	});
});
