import { HiviUap } from './hivi-uap-ad.page';

class HiviUapStickyBfab extends HiviUap {
	constructor() {
		super();
		this.pageLink = 'templates/hivi-uap-sticky-bfab/';
		this.videoPlayer = '.video-player.video-player-right';
		this.bottomContent = '.bottom-content';
		this.footer = 'footer';
	}
}

export const hiviUapStickyBfab = new HiviUapStickyBfab();
