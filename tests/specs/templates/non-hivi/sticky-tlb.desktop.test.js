import { expect } from 'chai';
import { stickyTlb } from '../../../pages/sticky-tlb.page';
import { slots } from '../../../common/slot-registry';
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
		network.clearLogs();

		helpers.navigateToUrl(
			stickyTlb.pageLink,
			queryStrings.constructSingleGeoInstantGlobal('XX', 100),
		);
		slots.topLeaderboard.waitForDisplayed();
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('should stick and unstick', () => {
		helpers.fastScroll(5);
		expect(stickyTlb.isAdSticked()).to.be.true;
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.mediumScroll(600);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(network.checkIfMessageIsInLogs('unsticked')).to.be.true;
		expect(network.checkIfMessageIsInLogs('force-unstick')).to.be.false;
	});

	it('should not stick if viewability is counted', () => {
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.mediumScroll(500);
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
		helpers.mediumScroll(500);
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

		helpers.navigateToUrl(`${stickyTlb.pageLink}?disabled=1`);
		slots.topLeaderboard.waitForDisplayed();

		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);
	});
});
