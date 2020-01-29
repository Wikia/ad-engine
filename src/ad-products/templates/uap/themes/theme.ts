import { AdSlot } from '@ad-engine/core';
import { PorvataPlayer } from '../../../video/player/porvata/porvata';
import { UapVideoSettings } from '../uap-video-settings';
import { UapParams } from '../universal-ad-package';

export abstract class BigFancyAdTheme {
	container: HTMLElement;

	constructor(protected adSlot: AdSlot, protected params: UapParams) {
		this.container = this.adSlot.getElement();
	}

	abstract onAdReady(): void;

	abstract adIsReady(videoSettings: UapVideoSettings): Promise<HTMLIFrameElement | HTMLElement>;

	abstract onVideoReady(video: PorvataPlayer): void;
}
