import { expect } from 'chai';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { network } from '../../../common/network';
import { helpers } from '../../../common/helpers';

describe('Desktop HiVi UAP ads page: top leaderboard', () => {
	before(() => {
		network.enableLogCapturing();
		network.captureConsole();
		network.clearLogs();
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('unresolved: should log message to console that force-close event was triggered by TLB', () => {
		const message = 'onCustomEvent top_leaderboard force-unstick';

		hiviUap.openUapWithState(false, hiviUap.pageLink, adSlots.topLeaderboard);
		helpers.mediumScroll(600);
		$(hiviUap.closeLeaderboardButton).waitForDisplayed(timeouts.standard);

		$(hiviUap.closeLeaderboardButton).click();
		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);
	});
});
