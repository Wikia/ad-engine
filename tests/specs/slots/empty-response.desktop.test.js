import { expect } from 'chai';
import { emptyResponse } from '../../pages/empty-response.page';
import { adSlots } from '../../common/ad-slots';
import { timeouts } from '../../common/timeouts';

describe('Empty response page: top leaderboard', () => {
	let adStatus;

	before(() => {
		browser.url(emptyResponse.pageLink);
		$(emptyResponse.article).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard);
	});

	it('Check if slot is not visible', () => {
		adSlots.waitForSlotResult(adSlots.topLeaderboard, adSlots.adCollapsed);
		expect(adStatus.inViewport, 'Slot in viewport').to.be.false;
	});
});

describe('Empty response page: top boxad', () => {
	let adStatus;

	before(() => {
		browser.url(emptyResponse.pageLink);
		$(emptyResponse.article).waitForDisplayed(timeouts.standard);
		adSlots.waitForSlotResult(adSlots.topBoxad, adSlots.adCollapsed);
		adStatus = adSlots.getSlotStatus(adSlots.topBoxad);
	});

	it('Check if slot is not visible', () => {
		expect(adStatus.inViewport, 'Slot in viewport').to.be.false;
	});
});
