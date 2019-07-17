import { AdSlot, context, PorvataPlayer, utils } from '@ad-engine/core';
import { BigFancyAdAboveConfig } from '../big-fancy-ad-above';
import { UapParams } from '../universal-ad-package';
import { VideoSettings } from '../video-settings';

/**
 * @abstract
 */
export class BigFancyAdTheme {
	container: HTMLElement;
	protected config: BigFancyAdAboveConfig;

	constructor(protected adSlot: AdSlot, protected params: UapParams) {
		this.container = this.adSlot.getElement();
		this.config = context.get('templates.bfaa') || {};
	}

	/**
	 * @abstract
	 */
	onAdReady(): void {
		throw new utils.NotImplementedException();
	}

	/**
	 * @abstract
	 */
	async adIsReady(videoSettings: VideoSettings): Promise<void> {
		throw new utils.NotImplementedException({ videoSettings });
	}

	/**
	 * @abstract
	 */
	onVideoReady(video: PorvataPlayer): void {
		throw new utils.NotImplementedException();
	}
}
