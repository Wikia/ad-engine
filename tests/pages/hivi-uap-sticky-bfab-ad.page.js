import { HiviUap } from './hivi-uap-ad.page';

class HiviUapStickyBfab extends HiviUap {
	constructor() {
		super();
		this.pageLink = 'templates/hivi-uap-sticky-bfab/';
		this.videoPlayer = '.video-player.video-player-right';
		this.bottomContent = '.bottom-content';
		this.footer = 'footer';
		this.firstCall = '4466763538';
		this.secondCall = '4511050296';
	}
}

export const hiviUapStickyBfab = new HiviUapStickyBfab();
