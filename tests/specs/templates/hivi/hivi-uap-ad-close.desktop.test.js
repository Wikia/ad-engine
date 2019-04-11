import { expect } from 'chai';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import networkCapture from '../../../common/network-capture';

// TODO fix network capture
xdescribe('Desktop HiVi UAP ads page: top leaderboard', () => {
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
		logs.length = 0;
		await networkCapture.clearConsoleMessages(client);
	});

	after(async () => {
		await networkCapture.closeClient(client);
	});

	// TODO fix network capture
	xit('resolved: should log message to console that force-close event was triggered by TLB', () => {
		const message = 'Custom listener: onCustomEvent top_leaderboard force-close';

		hiviUap.openUapWithState(true, hiviUap.pageLink, adSlots.topLeaderboard);
		$('.button-unstick').waitForDisplayed(timeouts.standard);

		$('.button-unstick').click();
		browser.waitUntil(
			() => networkCapture.logsIncludesMessage(message, logs, 'log', true),
			2000,
			`Logs should contain message: "${message}".\nLogs are: ${JSON.stringify(logs)}`,
		);
		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true));
	});

	// TODO fix network capture
	xit('unresolved: should log message to console that force-close event was triggered by TLB', () => {
		const message = 'Custom listener: onCustomEvent top_leaderboard force-close';

		hiviUap.openUapWithState(false, hiviUap.pageLink, adSlots.topLeaderboard);
		$('.button-unstick').waitForDisplayed(timeouts.standard);

		$('.button-unstick').click();
		browser.waitUntil(
			() => networkCapture.logsIncludesMessage(message, logs, 'log', true),
			2000,
			`Logs should contain message: "${message}".\nLogs are: ${JSON.stringify(logs)}`,
		);

		expect(networkCapture.logsIncludesMessage('force-unstick', logs, 'any', true)).to.be.false;
	});
});
