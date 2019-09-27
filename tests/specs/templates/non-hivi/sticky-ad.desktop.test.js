import { expect } from 'chai';
import { stickyAd } from '../../../pages/sticky-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { network } from '../../../common/network';

describe('sticky-ad template', () => {
	before(() => {
		network.enableLogCapturing();
		network.captureConsole();
	});
	beforeEach(() => {
		helpers.fastScroll(-2000);
		network.clearLogs();

		browser.url(stickyAd.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('should stick and unstick', () => {
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);
		helpers.mediumScroll(300);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard);

		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(1000);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);

		expect(network.checkIfMessageIsInLogs('force-unstick')).to.be.false;
		expect(network.checkIfMessageIsInLogs('force-close')).to.be.false;
	});

	it('should not stick if viewability is counted', () => {
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.mediumScroll(300);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);

		expect(network.checkIfMessageIsInLogs('force-unstick')).to.be.false;
		expect(network.checkIfMessageIsInLogs('force-close')).to.be.false;
	});

	it('should unstick if close button is clicked', () => {
		const message = 'Custom listener: onCustomEvent top_leaderboard force-unstick';

		helpers.mediumScroll(200);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard);
		$(`${stickyAd.stickedSlot} ${stickyAd.classUnstickButton}`).click();
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);

		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);

		expect(network.checkIfMessageIsInLogs('force-close')).to.be.false;
	});

	it('should emit "stickiness-disabled event" if stickiness is disabled', () => {
		const message = '👁 Custom listener: onCustomEvent top_leaderboard stickiness-disabled';

		browser.url(`${stickyAd.pageLink}?disabled=1`);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(200);

		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);
	});
});
