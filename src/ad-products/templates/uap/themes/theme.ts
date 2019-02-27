import { context, utils } from '@wikia/ad-engine';

/**
 * @abstract
 */
export class BigFancyAdTheme {
	constructor(adSlot, params) {
		this.adSlot = adSlot;
		this.container = this.adSlot.getElement();
		this.config = context.get('templates.bfaa');
		this.params = params;
	}

	/**
	 * @abstract
	 */
	onAdReady() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @abstract
	 */
	async adIsReady(videoSettings) {
		throw new utils.NotImplementedException({ videoSettings });
	}

	/**
	 * @abstract
	 */
	onVideoReady() {
		throw new utils.NotImplementedException();
	}
}
