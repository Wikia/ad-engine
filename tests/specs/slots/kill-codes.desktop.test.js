import { expect } from 'chai';
import { blockBtfAd } from '../../pages/kill-codes.page';
import { slots } from '../../common/slot-registry';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';

describe('Kill codes ads page', () => {
	it('Check if BTF boxad slot is visible when disableBtf set to false', () => {
		helpers.navigateToUrl(blockBtfAd.pageLink, queryStrings.disableBtf(false));
		slots.topBoxad.scrollIntoView();
		expect(slots.topBoxad.isDisplayed(), 'Top boxad not visible').to.be.true;
	});

	it('Check if BTF boxad slot is hidden when disableBtf set to true', () => {
		helpers.navigateToUrl(blockBtfAd.pageLink, queryStrings.disableBtf(true));
		slots.topBoxad.scrollIntoView();
		expect(slots.topBoxad.isDisplayed(), 'Top boxad is visible').to.be.false;
	});

	it('Check if ATF boxad slot is visible when disableSecondCall set to false', () => {
		helpers.navigateToUrl(blockBtfAd.pageLink, queryStrings.disableSecondCall(false));
		slots.topBoxad.waitForDisplayed();
		slots.topBoxad.scrollIntoView();
		expect(slots.topBoxad.isDisplayed(), 'Top boxad not visible').to.be.true;
	});

	it('Check if ATF boxad slot is hidden when disableSecondCall set to true', () => {
		helpers.navigateToUrl(blockBtfAd.pageLink, queryStrings.disableSecondCall(true));
		slots.topBoxad.scrollIntoView();
		expect(slots.topBoxad.isDisplayed(), 'Top boxad is visible').to.be.false;
	});

	it('Check if ATF and BTF boxads are hidden when both flags set to true', () => {
		helpers.navigateToUrl(
			blockBtfAd.pageLink,
			queryStrings.disableBtf(true),
			queryStrings.disableSecondCall(true),
		);
		slots.topBoxad.scrollIntoView();
		expect(slots.topBoxad.isDisplayed(), 'Top boxad is visible').to.be.false;

		slots.topBoxad.scrollIntoView();
		expect(slots.topBoxad.isDisplayed(), 'Top boxad is visible').to.be.false;
	});
});
