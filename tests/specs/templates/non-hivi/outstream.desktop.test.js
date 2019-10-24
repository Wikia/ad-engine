import { expect } from 'chai';
import { outstream } from '../../../pages/outstream.page';
import { adSlots } from '../../../common/ad-slots';
import { slots } from '../../../common/slot-registry';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';
import { network } from '../../../common/network';

describe('Outstream ads', () => {
	let adStatus;

	beforeEach(() => {
		network.enableCapturing(outstream.callForPlayer);
	});

	it('Check if video is visible in viewport', () => {
		helpers.navigateToUrl(outstream.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForViewabillityCounted(timeouts.standard);
		helpers.slowScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();
		adStatus = slots.incontentPlayer.status;
		expect(adStatus.visible, 'Not in viewport').to.be.true;
	});

	it('Check if video is visible while floating', () => {
		helpers.navigateToUrl(outstream.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForViewabillityCounted(timeouts.standard);
		helpers.slowScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();
		adStatus = slots.incontentPlayer.status;
		expect($(adSlots.incontentPlayer).isDisplayed(), 'Incontent not visible').to.be.true;
		helpers.waitForViewabillityCounted(timeouts.actions);
		helpers.fastScroll(-2000);
		helpers.slowScroll(outstream.pageLength);
		helpers.waitForViewabillityCounted(timeouts.actions);
		expect($(outstream.floatingPlayer).isExisting(), 'Floating not visible').to.be.true;
	});

	it('Check video with empty response', () => {
		helpers.navigateToUrl(outstream.pageLink, queryStrings.getEmptyResponse(true));
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForViewabillityCounted();
		helpers.slowScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();
		adStatus = slots.incontentPlayer.status;
		expect(adStatus.inViewport, 'Not in viewport').to.be.false;
	});

	it('Check if call for player is sent to GAM', () => {
		expect(
			network.checkIfHasResponse(outstream.porvataSlot),
			'Call for player not registered in network tab',
		).to.be.true;
	});
});

describe('Outstream ads - Direct Porvata', () => {
	let adStatus;

	before(() => {
		network.enableCapturing(outstream.callForPlayer);
		helpers.fastScroll(-2000);
		helpers.navigateToUrl(outstream.pageLink, queryStrings.getPorvataDirect(true));
		helpers.slowScroll(outstream.pageLength);
		slots.incontentPlayer.scrollIntoView();
		adStatus = slots.incontentPlayer.status;
	});

	it('Check if Direct Porvata player is visible', () => {
		expect(
			$(`${adSlots.incontentPlayer} ${outstream.videoPlayer}`).isDisplayed(),
			'Incontent not visible',
		).to.be.true;
	});

	it('Check if Direct Porvata is loaded directly', () => {
		expect(network.checkIfHasResponse(outstream.porvataSlot)).to.be.false;
	});
});
