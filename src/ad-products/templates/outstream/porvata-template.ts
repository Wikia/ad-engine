import { AdSlot, context, events, eventService, slotTweaker } from '@ad-engine/core';
import { Porvata, PorvataTemplateParams, VpaidMode } from '../..';
import { getTranslation } from '../../common/i18n';
import { PorvataPlayer } from '../../video/porvata4/porvata-player';
import * as videoUserInterface from '../interface/video';

import DynamicReveal from '../interface/video/dynamic-reveal';
import Floating from '../interface/video/floating';
import ProgressBar from '../interface/video/progress-bar';
import VolumeControl from '../interface/video/volume-control';

export const DEFAULT_VIDEO_ASPECT_RATIO = 640 / 360;
export const FLOATING_VIDEO_ASPECT_RATIO = 640 / 480;

export interface PorvataTemplateConfig {
	isFloatingEnabled?: boolean;
	inViewportOffsetTop?: number;
	inViewportOffsetBottom?: number;
	onInit: (adSlot: AdSlot, params: PorvataTemplateParams, config: PorvataTemplateConfig) => void;
}

/**
 * TODO: Revisit responsibilities of this template. Shouldn't we move some parts to Porvata logic?
 */
export class PorvataTemplate {
	static getName(): string {
		return 'porvata3';
	}

	static getDefaultConfig(): PorvataTemplateConfig {
		return {
			isFloatingEnabled: true,
			inViewportOffsetTop: 0,
			inViewportOffsetBottom: 0,
			onInit: () => {},
		};
	}

	config: PorvataTemplateConfig;
	isInsecureMode: boolean;

	constructor(public adSlot: AdSlot) {
		this.config = context.get('templates.porvata3') || {};
	}

	init(params: PorvataTemplateParams): Promise<PorvataPlayer> | void {
		if (!this.adSlot.getElement().classList.contains('ad-slot')) {
			this.adSlot.getElement().classList.add('ad-slot');
		}

		this.adSlot.getElement().classList.add('porvata3');
		this.adSlot.getElement().setAttribute('data-label', getTranslation('labels', 'advertisement'));

		this.isInsecureMode = params.vpaidMode === VpaidMode.INSECURE;

		if (!Porvata.isVideoAutoplaySupported()) {
			return this.adSlot.collapse();
		}

		params.viewportHookElement = this.adSlot.getElement();
		if (this.isInsecureMode) {
			params.container = Porvata.createVideoContainer(this.adSlot.getElement());
		}

		if (!this.adSlot.config.disableExpandAnimation) {
			slotTweaker.collapse(this.adSlot);
		}

		this.config.onInit(this.adSlot, params, this.config);

		context.set('options.video.porvataLoaded', true);

		return slotTweaker
			.makeResponsive(this.adSlot, DEFAULT_VIDEO_ASPECT_RATIO)
			.then(() =>
				Porvata.inject(params).then((video: PorvataPlayer) => this.onReady(video, params)),
			);
	}

	onReady(player: PorvataPlayer, params: PorvataTemplateParams): PorvataPlayer {
		const slotElement: HTMLElement = this.adSlot.getElement();
		const template = [DynamicReveal, Floating, ProgressBar, VolumeControl];

		if (this.isInsecureMode) {
			this.adjustVpaidPlayer(player);
		}

		slotElement.classList.add('porvata-outstream');

		player.addEventListener('loaded', () => {
			player.dom.getVideoContainer().classList.remove('hide');
		});

		window.addEventListener('resize', () => {
			if (!player.isFloating) {
				const slotWidth = slotElement.clientWidth;

				player.resize(slotWidth, slotWidth / DEFAULT_VIDEO_ASPECT_RATIO);
			}
		});

		this.handleSlotStatus(player);

		eventService.once(events.PAGE_CHANGE_EVENT, () => {
			player.destroy();
		});

		videoUserInterface.setup(player, player.dom.getInterfaceContainer(), template, {
			container: player.dom.getInterfaceContainer(),
			inViewportOffsetTop: this.config.inViewportOffsetTop,
			inViewportOffsetBottom: this.config.inViewportOffsetBottom,
			isFloatingEnabled: this.config.isFloatingEnabled && params.enableInContentFloating,
			slotName: this.adSlot.getSlotName(),
		});

		return player;
	}

	handleSlotStatus(video: PorvataPlayer): void {
		let resolveStatus: () => void = null;
		const statusPromise = new Promise((resolve) => {
			resolveStatus = resolve;
		});

		video.addEventListener('wikiaAdsManagerLoaded', () => {
			this.adSlot.success();
			resolveStatus();
		});

		video.addEventListener('wikiaFirstTimeInViewport', () => {
			statusPromise.then(() => {
				const eventSuffix =
					this.adSlot.getStatus() === AdSlot.STATUS_SUCCESS ? 'WithOffer' : 'WithoutOffer';

				video.dispatchEvent(`wikiaInViewport${eventSuffix}`);
			});
		});

		video.addEventListener('wikiaEmptyAd', () => {
			this.adSlot.collapse();
			resolveStatus();
		});
	}

	/**
	 * TODO: Shouldn't we move this logic to Porvata code?
	 */
	adjustVpaidPlayer(video: PorvataPlayer): void {
		video.addEventListener('loaded', (event: google.ima.AdEvent) => {
			const ad: google.ima.Ad = event.getAd();

			if (ad && Porvata.isVpaid(ad.getContentType() || '')) {
				video.dom.getPlayerContainer().classList.add('vpaid-enabled');
				video.dom.getPlayerContainer().classList.remove('hide');
			}
		});

		video.addEventListener('allAdsCompleted', () => {
			video.dom.getPlayerContainer().classList.add('hide');
		});
	}
}
