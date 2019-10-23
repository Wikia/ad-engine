import { hiviUapCtp } from '../../../pages/hivi-uap-ctp-ad.page';
import { hiviPage } from '../../../pages/hivi.page';
import { slots } from '../../../common/slot-registry';
import { helpers } from '../../../common/helpers';

describe('Desktop HiVi UAP CTP ads page: top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUapCtp.pageLink);
		slots.topLeaderboard.waitForDisplayed();
	});

	it('load page and do nothing', () => {
		const expectedState = {
			aspectRatio: hiviPage.desktopImpactAspectRatio,
			isCloseButtonDisplayed: false,
			isReplayButtonDisplayed: true,
			isSticked: true,
			isAboveTheViewport: false,
			isVideoPlaying: false,
			isAudioEnabled: false,
		};

		hiviPage.waitForVideoToProgress(1000);
		hiviPage.assertHiViFanTakeoverAdSlot(expectedState);
	});

	it.only('load page and do nothing', () => {
		const expectedState = {
			aspectRatio: hiviPage.desktopImpactAspectRatio,
			isCloseButtonDisplayed: false,
			isReplayButtonDisplayed: false,
			isSticked: true,
			isAboveTheViewport: false,
			isVideoPlaying: true,
			isAudioEnabled: true,
		};

		hiviPage.waitForVideoToProgress(1000);
		hiviPage.clickReplay(slots.topLeaderboard);
		hiviPage.waitForVideoToProgress(1000);
		hiviPage.assertHiViFanTakeoverAdSlot(expectedState);
	});
});
