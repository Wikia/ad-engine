import { expect } from 'chai';
import { jwPlayer } from '../../pages/jwplayer.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';

describe('jwPlayer player', () => {
	before(() => {
		helpers.navigateToUrl(jwPlayer.pageLink);
		$(jwPlayer.player).waitForDisplayed(timeouts.standard);
	});

	beforeEach(() => {
		helpers.closeNewTabs();
		helpers.navigateToUrl(jwPlayer.pageLink);
		$(jwPlayer.player).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
	});

	it('Check if player is visible', () => {
		expect($(jwPlayer.player).isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if dimensions are correct', () => {
		expect($(jwPlayer.player).getSize('height')).to.equal(jwPlayer.playerHeight);
		expect($(jwPlayer.player).getSize('width')).to.equal(jwPlayer.playerWidth);
	});

	it('Check if redirect on click on default player works', () => {
		$(jwPlayer.player).click();
		browser.switchWindow(helpers.clickThroughUrlDomain);
		helpers.waitForUrl(helpers.clickThroughUrlDomain);
		expect(browser.getUrl()).to.include(
			helpers.clickThroughUrlDomain,
			`Wrong page loaded: expected ${helpers.clickThroughUrlDomain}`,
		);
		helpers.closeNewTabs();
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
