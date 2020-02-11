import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { timeouts } from '../../../common/timeouts';
import { network } from '../../../common/network';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';
import { slots } from '../../../common/slot-registry';

describe('Desktop HiVi UAP ads page: top leaderboard', () => {
	before(() => {
		network.enableLogCapturing();
		network.captureConsole();
		network.clearLogs();
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('Impact: should log message to console that force-close event was triggered by TLB', () => {
		const message = 'Slot tracker: top_leaderboard force-unstick ';

		helpers.navigateToUrl(hiviUap.pageLink, queryStrings.getResolvedState(false));
		slots.topLeaderboard.waitForDisplayed();
		helpers.mediumScroll(400);
		$(hiviUap.closeLeaderboardButton).waitForDisplayed(timeouts.standard);

		$(hiviUap.closeLeaderboardButton).click();
		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(message),
			2000,
			`Logs should contain message: ${message}`,
		);
	});
});
