import {
	AdSlot,
	context,
	events,
	eventService,
	Porvata,
	PorvataPlayer,
	PorvataTemplateParams,
	slotTweaker,
	VpaidMode,
} from '@ad-engine/core';
import { getTranslation } from '../../common/i18n';
import * as videoUserInterface from '../interface/video';

export const DEFAULT_VIDEO_ASPECT_RATIO = 640 / 360;
export const FLOATING_VIDEO_ASPECT_RATIO = 640 / 480;

export interface PorvataTemplateConfig {
	isFloatingEnabled: boolean;
	inViewportOffsetTop: number;
	inViewportOffsetBottom: number;
	onInit: (adSlot: AdSlot, params: PorvataTemplateParams, config: PorvataTemplateConfig) => void;
}

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
			params.originalContainer = params.container;
			params.container = this.createVideoContainer();
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

	onReady(video: PorvataPlayer, params: PorvataTemplateParams): PorvataPlayer {
		const slotElement: HTMLElement = this.adSlot.getElement();
		const template: string = videoUserInterface.selectTemplate(video.videoSettings);
		const videoContainer: HTMLElement = params.container;

		if (this.isInsecureMode) {
			this.adjustVpaidPlayer(video, videoContainer);
		}

		slotElement.classList.add('porvata-outstream');

		video.addEventListener('loaded', () => {
			video.container.classList.remove('hide');
		});

		window.addEventListener('resize', () => {
			if (!video.isFloating) {
				const slotWidth = slotElement.clientWidth;

				video.resize(slotWidth, slotWidth / DEFAULT_VIDEO_ASPECT_RATIO);
			}
		});

		this.handleSlotStatus(video);

		eventService.once(events.PAGE_CHANGE_EVENT, () => {
			video.destroy();
		});

		videoUserInterface.setup(video, template, {
			container: videoContainer,
			inViewportOffsetTop: this.config.inViewportOffsetTop,
			inViewportOffsetBottom: this.config.inViewportOffsetBottom,
			isFloatingEnabled: this.config.isFloatingEnabled && params.enableInContentFloating,
			slotName: params.slotName,
		});

		return video;
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

				video.ima.dispatchEvent(`wikiaInViewport${eventSuffix}`);
			});
		});

		video.addEventListener('wikiaEmptyAd', () => {
			this.adSlot.collapse();
			resolveStatus();
		});
	}

	adjustVpaidPlayer(video: PorvataPlayer, container: HTMLElement): void {
		const videoPlayer = container.querySelector<HTMLVideoElement>('.video-player');

		video.addEventListener('loaded', (event: google.ima.AdEvent) => {
			const ad: google.ima.Ad = event.getAd();

			if (ad && Porvata.isVpaid(ad.getContentType() || '')) {
				container.classList.add('vpaid-enabled');
				videoPlayer.classList.remove('hide');
			}
		});

		video.addEventListener('allAdsCompleted', () => {
			container.classList.add('hide');
		});
	}

	createVideoContainer(): HTMLElement {
		const container: HTMLElement = document.createElement('div');
		const displayWrapper: HTMLElement = document.createElement('div');

		container.classList.add('video-overlay');
		displayWrapper.classList.add('video-display-wrapper');

		container.appendChild(displayWrapper);
		this.adSlot.getElement().appendChild(container);

		return displayWrapper;
	}
}
