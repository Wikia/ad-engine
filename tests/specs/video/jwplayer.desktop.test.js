import { expect } from 'chai';
import { jwPlayer } from '../../pages/jwplayer.page';
import { timeouts } from '../../common/timeouts';
import { adSlots } from '../../common/ad-slots';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';

describe('jwPlayer player', () => {
	let adStatus;

	before(() => {
		browser.url(jwPlayer.pageLink);
		$(jwPlayer.player).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(jwPlayer.player);
	});

	beforeEach(() => {
		browser.switchWindow(jwPlayer.pageLink);
		browser.url(jwPlayer.pageLink);
		$(jwPlayer.player).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
	});

	afterEach(() => {
		browser.switchWindow(jwPlayer.pageLink);
	});

	it('Check if player is visible', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			jwPlayer.player,
			jwPlayer.playerWidth,
			jwPlayer.playerHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if redirect on click on default player works', () => {
		$(jwPlayer.player).click();
		browser.switchWindow(helpers.clickThroughUrlDomain);
		helpers.waitForUrl(helpers.clickThroughUrlDomain);
		expect(browser.getUrl()).to.include(
			helpers.clickThroughUrlDomain,
			`Wrong page loaded: expected ${helpers.clickThroughUrlDomain}`,
		);
		browser.closeWindow();
	});

	it('Check if preroll works', () => {
		$(jwPlayer.player).waitForExist(timeouts.standard);
		expect(jwPlayer.isVideoAdVisible()).to.be.true;
	});

	it('Check if midroll works', () => {
		helpers.navigateToUrl(jwPlayer.pageLink, queryStrings.getMidroll(true));
		$(jwPlayer.player).waitForExist(timeouts.standard);
		jwPlayer.waitForAdToChangeState(true);
		helpers.waitForVideoAdToFinish(jwPlayer.prerollDuration);
		jwPlayer.waitForAdToChangeState(false);
		helpers.waitForVideoToProgress(16000);
		jwPlayer.waitForAdToChangeState(true);
	});

	it('Check if postroll works', () => {
		helpers.navigateToUrl(jwPlayer.pageLink, queryStrings.getPostroll(true));
		$(jwPlayer.player).waitForExist(timeouts.standard);
		jwPlayer.waitForAdToChangeState(true);
		helpers.waitForVideoAdToFinish(jwPlayer.prerollDuration);
		jwPlayer.waitForAdToChangeState(false);
		helpers.waitForVideoToProgress(30000);
		jwPlayer.waitForAdToChangeState(true);
	});

	it('Check if f15n works', () => {
		helpers.navigateToUrl(jwPlayer.pageLink, queryStrings.getF15n());
		$(jwPlayer.player).waitForExist(timeouts.standard);
		jwPlayer.waitForAdToChangeState(false);
		helpers.waitForVideoToProgress(10000);
		jwPlayer.waitForAdToChangeState(true);
		helpers.waitForVideoAdToFinish(jwPlayer.f15nDuration);
		jwPlayer.waitForAdToChangeState(false);
	});

	it('Check if autoplay is disabled upon entering the page', () => {
		helpers.navigateToUrl(jwPlayer.pageLink, queryStrings.getAutoplay(false));
		$(jwPlayer.player).waitForDisplayed(timeouts.standard);
		expect($(jwPlayer.videoIdle).isExisting()).to.be.true;
	});
});
