import { expect } from 'chai';
import { stickyTlb } from '../../../pages/sticky-tlb.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';
import { network } from '../../../common/network';

describe('sticky-tlb template', () => {
	before(() => {
		network.enableLogCapturing();
		network.captureConsole();
	});

	beforeEach(() => {
		helpers.fastScroll(-2000);
		network.clearLogs();

		helpers.navigateToUrl(
			stickyTlb.pageLink,
			queryStrings.constructSingleGeoInstantGlobal('XX', 100),
		);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('should stick and unstick', () => {
		helpers.fastScroll(5);
		expect(stickyTlb.isAdSticked()).to.be.true;
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(600);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(network.checkIfMessageIsInLogs('unsticked')).to.be.true;
		expect(network.checkIfMessageIsInLogs('force-unstick')).to.be.false;
	});

	it('should not stick if viewability is counted', () => {
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(500);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(network.checkIfMessageIsInLogs('unsticked')).to.be.true;
		expect(network.checkIfMessageIsInLogs('force-unstick')).to.be.false;
	});

	it('should not stick if geo is set to 0', () => {
		helpers.navigateToUrl(
			stickyTlb.pageLink,
			queryStrings.constructSingleGeoInstantGlobal('XX', 0.00000001),
		);
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(500);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(network.checkIfMessageIsInLogs('unsticked'), 'Unsticked event recored').to.be.false;
		expect(network.checkIfMessageIsInLogs('force-unstick'), 'Force-unstick event recorded').to.be
			.false;
	});

	it('should unstick if close button is clicked', () => {
		const message = 'onCustomEvent top_leaderboard force-close';

		helpers.mediumScroll(100);
		expect(stickyTlb.isAdSticked()).to.be.true;
		$(stickyTlb.classUnstickButton).click();
		browser.pause(timeouts.actions);
		expect(stickyTlb.isAdSticked()).to.be.false;

		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);
	});

	it.only('should emit "stickiness-disabled event" if stickiness is disabled', () => {
		const message = '👁 Custom listener: onCustomEvent top_leaderboard stickiness-disabled';

		browser.url(`${stickyTlb.pageLink}?disabled=1`);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);

		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);
	});
});
