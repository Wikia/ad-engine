import { expect } from 'chai';
import { stickyAd } from '../../../pages/sticky-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import networkCapture from '../../../common/network-capture';

// TODO Network capture
xdescribe('sticky-ad template', () => {
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

		browser.url(stickyAd.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	after(async () => {
		await networkCapture.closeClient(client);
	});

	it('should stick and unstick', () => {
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);
		helpers.slowScroll(500);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard);

		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(1000);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
		expect(networkCapture.logsIncludesMessage('force-close', logs, 'any', true)).to.be.false;
	});

	it('should not stick if viewability is counted', () => {
		helpers.waitForViewabillityCounted(timeouts.unstickTime);
		helpers.slowScroll(500);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
		expect(networkCapture.logsIncludesMessage('force-close', logs, 'any', true)).to.be.false;
	});

	it('should unstick if close button is clicked', () => {
		const message = 'Custom listener: onCustomEvent top_leaderboard force-unstick';

		helpers.slowScroll(200);
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard);
		$(`${stickyAd.stickedSlot} ${stickyAd.classUnstickButton}`).click();
		$(stickyAd.stickedSlot).waitForExist(timeouts.standard, true);

		browser.waitUntil(
			() => networkCapture.logsIncludesMessage(message, logs, 'log', true),
			2000,
			`Logs should contain message: "${message}".\nLogs are: ${JSON.stringify(logs)}`,
		);
		expect(networkCapture.logsIncludesMessage('force-close', logs, 'any', true)).to.be.false;
	});

	it('should emit "stickiness-disabled event" if stickiness is disabled', () => {
		const message = '👁 Custom listener: onCustomEvent top_leaderboard stickiness-disabled';

		browser.url(`${stickyAd.pageLink}?disabled=1`);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(200);

		browser.waitUntil(
			() => networkCapture.logsIncludesMessage(message, logs, 'log', true),
			2000,
			`Logs should contain message: "${message}".\nLogs are: ${JSON.stringify(logs)}`,
		);
	});
});
