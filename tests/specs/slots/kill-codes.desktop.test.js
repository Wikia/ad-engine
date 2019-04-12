import { expect } from 'chai';
import { blockBtfAd } from '../../pages/kill-codes.page';
import { adSlots } from '../../common/ad-slots';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';

describe('Kill codes ads page', () => {
	let adStatus;

	it('Check if BTF boxad slot is visible when disableBtf set to false', () => {
		browser.url(`${blockBtfAd.pageLink}?disableBtf=false`, timeouts.standard);
		helpers.slowScroll(2000);
		adStatus = adSlots.getSlotStatus(adSlots.incontentBoxad, true);
		expect(adStatus.inViewport, 'Visible in viewport').to.be.true;
	});

	it('Check if BTF boxad slot is hidden when disableBtf set to true', () => {
		browser.url(`${blockBtfAd.pageLink}?disableBtf=true`, timeouts.standard);
		helpers.slowScroll(2000);
		adStatus = adSlots.getSlotStatus(adSlots.incontentBoxad, true);
		expect(adStatus.inViewport, 'Visible in viewport').to.be.false;
	});

	it('Check if ATF boxad slot is visible when disableSecondCall set to false', () => {
		browser.url(`${blockBtfAd.pageLink}?disableSecondCall=false`, timeouts.standard);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topBoxad, true);
		expect(adStatus.inViewport, 'Visible in viewport').to.be.true;
	});

	it('Check if ATF boxad slot is hidden when disableSecondCall set to true', () => {
		browser.url(`${blockBtfAd.pageLink}?disableSecondCall=true`, timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topBoxad, true);
		expect(adStatus.inViewport, 'Visible in viewport').to.be.false;
	});

	it('Check if ATF and BTF boxads are hidden when both flags set to true', () => {
		browser.url(`${blockBtfAd.pageLink}?disableSecondCall=true&disableBtf=true`, timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topBoxad, true);
		expect(adStatus.inViewport, 'Visible in viewport').to.be.false;

		helpers.slowScroll(2000);
		adStatus = adSlots.getSlotStatus(adSlots.incontentBoxad, true);
		expect(adStatus.inViewport, 'Visible in viewport').to.be.false;
	});
});
