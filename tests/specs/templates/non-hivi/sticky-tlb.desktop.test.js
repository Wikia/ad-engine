import { expect } from 'chai';
import { stickyTlb } from '../../../pages/sticky-tlb.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';
import networkCapture from '../../../common/network-capture';

// TODO Network capture
xdescribe('sticky-tlb template', () => {
	let client;
	const logs = [];

	before(async () => {
		client = await networkCapture.getClient();

		client.on('Log.entryAdded', (entry) => {
			logs.push(entry.entry);
		});

		client.on('Console.messageAdded', (entry) => {
			logs.push(entry.message);
		});
	});

	beforeEach(async () => {
		helpers.fastScroll(-2000);
		logs.length = 0;
		await networkCapture.clearConsoleMessages(client);

		helpers.navigateToUrl(
			stickyTlb.pageLink,
			queryStrings.constructSingleGeoInstantGlobal('XX', 100),
		);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	after(async () => {
		await networkCapture.closeClient(client);
	});

	it('should stick and unstick', () => {
		helpers.slowScroll(500);
		expect(stickyTlb.isAdSticked()).to.be.true;
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(1000);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
		expect(networkCapture.logsIncludesMessage('force-close', logs, 'any', true)).to.be.false;
	});

	it('should not stick if viewability is counted', () => {
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(500);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
		expect(networkCapture.logsIncludesMessage('force-close', logs, 'any', true)).to.be.false;
	});

	it('should not stick if geo is set to 0', () => {
		helpers.navigateToUrl(
			stickyTlb.pageLink,
			queryStrings.constructSingleGeoInstantGlobal('XX', 0.00000001),
		);
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(500);
		expect(stickyTlb.isAdSticked()).to.be.false;

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
		expect(networkCapture.logsIncludesMessage('force-close', logs, 'any', true)).to.be.false;
	});

	it('should unstick if close button is clicked', () => {
		const message = 'Custom listener: onCustomEvent top_leaderboard force-close';

		helpers.slowScroll(200);
		expect(stickyTlb.isAdSticked()).to.be.true;
		$(`${stickyTlb.classUnstickButton}`).click();
		browser.pause(timeouts.actions);
		expect(stickyTlb.isAdSticked()).to.be.false;

		browser.waitUntil(
			() => networkCapture.logsIncludesMessage(message, logs, 'log', true),
			2000,
			`Logs should contain message: "${message}".\nLogs are: ${JSON.stringify(logs)}`,
		);

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
	});

	it('should emit "stickiness-disabled event" if stickiness is disabled', () => {
		const message = '👁 Custom listener: onCustomEvent top_leaderboard stickiness-disabled';

		browser.url(`${stickyTlb.pageLink}?disabled=1`);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);

		browser.waitUntil(
			() => networkCapture.logsIncludesMessage(message, logs, 'log', true),
			2000,
			`Logs should contain message: "${message}".\nLogs are: ${JSON.stringify(logs)}`,
		);
	});
});
