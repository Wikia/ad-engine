import { AdSlot, context, PorvataPlayer } from '@ad-engine/core';
import { BigFancyAdAboveConfig } from '../big-fancy-ad-above';
import { UapParams } from '../universal-ad-package';
import { VideoSettings } from '../video-settings';

export abstract class BigFancyAdTheme {
	container: HTMLElement;
	protected config: BigFancyAdAboveConfig;

	constructor(protected adSlot: AdSlot, protected params: UapParams) {
		this.container = this.adSlot.getElement();
		this.config = context.get('templates.bfaa') || {};
	}

	abstract onAdReady(): void;

	abstract adIsReady(videoSettings: VideoSettings): Promise<HTMLIFrameElement | HTMLElement>;

	abstract onVideoReady(video: PorvataPlayer): void;
}
