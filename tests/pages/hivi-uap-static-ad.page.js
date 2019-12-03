import { HiviUap } from './hivi-uap-ad.page';

class HiviUapStatic extends HiviUap {
	constructor() {
		super();
		this.pageLink = 'templates/hivi-uap-static/';
		this.firstCall = '5235061889'; // applies only to top leaderboard
		this.secondCall = '5235065000'; // top and incontent boxad and bottom leaderboard
	}
}

export const hiviUapStatic = new HiviUapStatic();
