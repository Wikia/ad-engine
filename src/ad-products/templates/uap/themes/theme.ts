import { AdSlot, context } from '@ad-engine/core';
import { PorvataPlayer } from '../../../video/player/porvata/porvata';
import { BigFancyAdAboveConfig } from '../big-fancy-ad-above';
import { UapVideoSettings } from '../uap-video-settings';
import { UapParams } from '../universal-ad-package';

export abstract class BigFancyAdTheme {
	container: HTMLElement;
	protected config: BigFancyAdAboveConfig;

	constructor(protected adSlot: AdSlot, protected params: UapParams) {
		this.container = this.adSlot.getElement();
		this.config = context.get('templates.bfaa') || {};
	}

	abstract onAdReady(): void;

	abstract adIsReady(videoSettings: UapVideoSettings): Promise<HTMLIFrameElement | HTMLElement>;

	abstract onVideoReady(video: PorvataPlayer): void;
}
