import { expect } from 'chai';
import { porvata } from '../../pages/porvata.page';
import { timeouts } from '../../common/timeouts';
import { adSlots } from '../../common/ad-slots';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { jwPlayer } from '../../pages/jwplayer.page';

describe('Porvata player', () => {
	let adStatus;
	before(() => {
		browser.url(porvata.pageLink);
	});

	beforeEach(() => {
		browser.switchWindow(porvata.pageLink);
		browser.url(porvata.pageLink);
		$(porvata.player).waitForDisplayed(timeouts.standard);
		$(porvata.player).scrollIntoView();
		adStatus = adSlots.getSlotStatus(porvata.player);
		helpers.waitToStartPlaying();
		$(porvata.videoPlayerHidden).waitForExist(timeouts.standard, true);
	});

	it('Check if player is visible', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			porvata.player,
			porvata.playerWidth,
			porvata.playerHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if redirect on click on default player works', () => {
		$(porvata.player).click();
		browser.switchWindow(helpers.clickThroughUrlDomain);
		helpers.waitForUrl(helpers.clickThroughUrlDomain);
		expect(browser.getUrl()).to.include(
			helpers.clickThroughUrlDomain,
			`Wrong page loaded: expected ${helpers.clickThroughUrlDomain}`,
		);
		browser.closeWindow();
	});

	it('Check if unmuting the video works', () => {
		$(porvata.unmuteButton).waitForDisplayed(timeouts.standard);
		$(porvata.unmuteButton).click();
		$(`${porvata.unmuteButton}${porvata.iconHidden}`).waitForExist(timeouts.standard);
	});

	it('Check if closing the player works', () => {
		$(porvata.closePlayerButton).waitForDisplayed(timeouts.standard);
		$(porvata.closePlayerButton).click();
		$(porvata.videoPlayerHidden).waitForExist(timeouts.standard);
	});

	it('Check if autoplay is disabled upon entering the page', () => {
		helpers.navigateToUrl(porvata.pageLink, queryStrings.getAutoplay(false));
		$(porvata.player).waitForExist(timeouts.standard);
		$(porvata.player).scrollIntoView();
		helpers.waitToStartPlaying();
		$(porvata.videoPlayerHidden).waitForExist(timeouts.standard);
	});
});
