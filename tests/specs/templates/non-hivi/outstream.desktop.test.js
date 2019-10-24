import { expect } from 'chai';
import { outstream } from '../../../pages/outstream.page';
import { slots } from '../../../common/slot-registry';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';
import { network } from '../../../common/network';

describe('Outstream ads', () => {
	beforeEach(() => {
		network.enableCapturing(outstream.callForPlayer);
		helpers.navigateToUrl(outstream.pageLink);
		helpers.mediumScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();
	});

	afterEach(() => {
		helpers.fastScroll(-2500);
		browser.refresh();
	});

	it('Check if video is visible in viewport', () => {
		expect(slots.incontentPlayer.isDisplayed(), 'Not in viewport').to.be.true;
	});

	it('Check if video is visible while floating', () => {
		helpers.waitForViewabillityCounted(timeouts.actions);
		helpers.mediumScroll(outstream.pageLength);
		helpers.waitForViewabillityCounted(timeouts.actions);

		expect($(outstream.floatingPlayer).isExisting(), 'Floating not visible').to.be.true;
	});

	it('Check if call for player is sent to GAM', () => {
		expect(
			network.checkIfHasResponse(outstream.porvataSlot),
			'Call for player not registered in network tab',
		).to.be.true;
	});
});

describe('Outstream with empty response', () => {
	it('Check video with empty response', () => {
		helpers.navigateToUrl(outstream.pageLink, queryStrings.getEmptyResponse(true));
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForViewabillityCounted();
		helpers.mediumScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();

		expect(slots.incontentPlayer.isDisplayedInViewport(), 'Not in viewport').to.be.false;
	});
});

describe('Outstream ads - Direct Porvata', () => {
	before(() => {
		network.enableCapturing(outstream.callForPlayer);
		helpers.navigateToUrl(outstream.pageLink, queryStrings.getPorvataDirect(true));
		helpers.mediumScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();
	});

	it('Check if Direct Porvata is loaded directly', () => {
		expect(network.checkIfHasResponse(outstream.porvataSlot)).to.be.false;
	});
});
