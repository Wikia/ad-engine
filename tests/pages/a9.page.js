import { timeouts } from '../common/timeouts';

class A9 {
	constructor() {
		this.pageLink = 'bidders/a9/';

		this.availableSlots = {
			topLeaderboard: 'top_leaderboard',
			topBoxad: 'top_boxad',
			incontentBoxad: 'incontent_boxad',
			bottomLeaderboard: 'bottom_leaderboard',
		};

		this.enableBidsButton = '#enableDebugMode';
		this.disableBidsButton = '#disableDebugMode';
	}

	enableA9Debug() {
		$(this.enableBidsButton).waitForEnabled(timeouts.standard);
		$(this.enableBidsButton).click();
	}
}

export const a9 = new A9();
