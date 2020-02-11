import { HiviUap } from './hivi-uap-ad.page';

class HiviUapStickinessNotAllowed extends HiviUap {
	constructor() {
		super();
		this.pageLink = 'templates/hivi-uap-stickiness-not-allowed/';
		this.videoPlayer = '#videoContainer';
		this.firstCall = '4466763538';
	}
}

export const hiviUapStickinessNotAllowed = new HiviUapStickinessNotAllowed();
