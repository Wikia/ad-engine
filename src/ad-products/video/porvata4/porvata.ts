import {
	AdSlot,
	context,
	events,
	eventService,
	SlotFiller,
	slotService,
	Targeting,
	templateService,
	utils,
} from '@ad-engine/core';
import { PorvataListener } from '../player/porvata/porvata-listener';
import { PorvataFactory } from './porvata-factory';
import { PorvataPlayer } from './porvata-player';
import { PorvataSettings } from './porvata-settings';

export interface PorvataTemplateParams {
	adProduct: string;
	autoPlay: boolean;
	blockOutOfViewportPausing: boolean;
	container: HTMLDivElement;
	enableInContentFloating?: boolean;
	hideWhenPlaying: HTMLElement;
	onReady?: (player: PorvataPlayer) => void;
	slotName: string;
	src: string;
	startInViewportOnly?: boolean;
	vastTargeting: Targeting;
	viewportHookElement?: HTMLElement;
	viewportOffsetBottom?: number;
	viewportOffsetTop?: number;
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
}

export interface PorvataGamParams {
	adProduct: string;
	autoPlay: boolean;
	blockOutOfViewportPausing: boolean;
	container: HTMLElement;
	creativeId: string;
	enableInContentFloating: boolean;
	height: number;
	lineItemId: string;
	loadVideoTimeout: number;
	slotName: string;
	src: string;
	startInViewportOnly: boolean;
	theme: string;
	trackingDisabled: boolean;
	type: string;
	vastTargeting: Targeting;
	vpaidMode: google.ima.ImaSdkSettings.VpaidMode;
	width: number;
}

export const VpaidMode = {
	DISABLED: 0,
	ENABLED: 1,
	INSECURE: 2,
};

/**
 * TODO:
 * 		@Szymon: Consider reimplementation of this idea. Currently we have two approaches of filling in
 * 		slots, they are: "provider" and "filler". In my opinion they are doing slightly the same thing.
 * 		It looks like another ad provider which could live along with gpt-provider and prebidium-provider.
 * 		But then we would need to change the way AdEngine handles providers and revisit how btfBlocker works.
 * 		Also, I believe it can be more general idea. We don't need to create 'porvata-provider' but some kind of
 * 		'template-provider', because the responsibility of this code should be loading configured (in context)
 * 		ad-product template (with certain set of parameters) directly instead of calling GPT.
 */
export class PorvataFiller implements SlotFiller {
	private containerId = 'playerContainer';
	private porvataParams: PorvataGamParams = {
		container: null,
		slotName: '',
		type: 'porvata3',
		theme: 'hivi',
		adProduct: 'incontent_veles',
		autoPlay: true,
		startInViewportOnly: true,
		blockOutOfViewportPausing: true,
		enableInContentFloating: false,
		width: 1,
		height: 1,
		src: context.get('src'),
		lineItemId: '',
		creativeId: '',
		trackingDisabled: false,
		loadVideoTimeout: 30000,
		vpaidMode: 2,
		vastTargeting: {
			pos: 'outstream',
		},
	};

	fill(adSlot: AdSlot): void {
		const player = document.createElement('div');
		player.setAttribute('id', this.containerId);

		adSlot.getElement().appendChild(player);

		this.porvataParams.vastTargeting.src = context.get('src');
		this.porvataParams.container = player;
		this.porvataParams.slotName = adSlot.getSlotName();

		const options = adSlot.getConfigProperty('customFillerOptions');

		if (options) {
			Object.keys(options).forEach((option) => {
				this.porvataParams[option] = options[option];
			});
		}

		templateService.init(this.porvataParams.type, adSlot, this.porvataParams);
		adSlot.setConfigProperty('trackEachStatus', true);
	}

	getContainer(): HTMLElement {
		return document.getElementById(this.containerId);
	}

	getName(): string {
		return 'porvata';
	}
}

/**
 * TODO:
 * 		@Szymon: Consider reimplementation of this class/logic. In my opinion it conflicts with PorvataFactory.
 * 		It does the same thing -- creates Porvata instance, but adds some additional logic which, I believe, could
 * 		be moved to the factory or split into some UI elements/Porvata plugins.
 */
export class Porvata {
	private static addOnViewportChangeListener(
		params: PorvataTemplateParams,
		listener: (isVisible: boolean) => void,
	): string {
		return utils.viewportObserver.addListener(
			params.viewportHookElement || params.container,
			listener,
			{
				offsetTop: params.viewportOffsetTop || 0,
				offsetBottom: params.viewportOffsetBottom || 0,
			},
		);
	}

	static createVideoContainer(parent: HTMLElement): HTMLDivElement {
		const container: HTMLElement = document.createElement('div');
		const displayWrapper: HTMLDivElement = document.createElement('div');

		container.classList.add('video-overlay');
		displayWrapper.classList.add('video-display-wrapper');

		container.appendChild(displayWrapper);
		parent.appendChild(container);

		return displayWrapper;
	}

	static inject(params: PorvataTemplateParams): Promise<PorvataPlayer> {
		const porvataListener = new PorvataListener({
			adProduct: params.adProduct,
			position: params.slotName,
			src: params.src,
			withAudio: !params.autoPlay,
			withCtp: !params.autoPlay,
		});

		let isFirstPlay = true;
		let autoPaused = false;
		let autoPlayed = false;
		let viewportListenerId: string = null;

		function muteFirstPlay(video: PorvataPlayer): void {
			video.addEventListener('wikiaAdsManagerLoaded', () => {
				if (isFirstPlay) {
					video.mute();
				}
			});
		}

		params.vastTargeting = params.vastTargeting || {};

		const videoSettings = new PorvataSettings(params);

		porvataListener.init();

		return PorvataFactory.create(videoSettings).then((player: PorvataPlayer) => {
			function inViewportCallback(isVisible: boolean): void {
				// Play video automatically only for the first time
				if (isVisible && !autoPlayed && params.autoPlay) {
					player.dispatchEvent('wikiaFirstTimeInViewport');
					player.play();
					autoPlayed = true;
					// Don't resume when video was paused manually
				} else if (isVisible && autoPaused) {
					player.resume();
					// Pause video once it's out of viewport and set autoPaused to distinguish manual
					// and auto pause
				} else if (!isVisible && player.isPlaying() && !params.blockOutOfViewportPausing) {
					player.pause();
					autoPaused = true;
				}
			}

			function setupAutoPlayMethod(): void {
				if (params.blockOutOfViewportPausing && !params.startInViewportOnly) {
					if (params.autoPlay && !autoPlayed) {
						autoPlayed = true;
						player.play();
					}
				} else {
					viewportListenerId = Porvata.addOnViewportChangeListener(params, inViewportCallback);
				}
			}

			porvataListener.registerVideoEvents(player);

			player.addEventListener('adCanPlay', () => {
				player.dispatchEvent('wikiaAdStarted');
				eventService.emit(events.VIDEO_AD_IMPRESSION, slotService.get(params.slotName));
			});
			player.addEventListener('allAdsCompleted', () => {
				if (player.isFullscreen()) {
					player.toggleFullscreen();
				}

				player.setAutoPlay(false);
				player.dispatchEvent('wikiaAdCompleted');
				if (viewportListenerId) {
					utils.viewportObserver.removeListener(viewportListenerId);
					viewportListenerId = null;
				}
				isFirstPlay = false;
				porvataListener.params.withAudio = true;
				porvataListener.params.withCtp = true;
			});
			player.addEventListener('wikiaAdRestart', () => {
				isFirstPlay = false;
			});
			player.addEventListener('start', () => {
				player.dispatchEvent('wikiaAdPlay');
				if (!viewportListenerId && !autoPlayed) {
					setupAutoPlayMethod();
				}
			});
			player.addEventListener('resume', () => {
				player.dispatchEvent('wikiaAdPlay');
				autoPaused = false;
			});
			player.addEventListener('pause', () => {
				player.dispatchEvent('wikiaAdPause');
			});
			player.addOnDestroyCallback(() => {
				if (viewportListenerId) {
					utils.viewportObserver.removeListener(viewportListenerId);
					viewportListenerId = null;
				}
			});

			if (params.autoPlay) {
				muteFirstPlay(player);
			}

			if (params.onReady) {
				params.onReady(player);
			}

			player.addEventListener('wikiaAdsManagerLoaded', () => {
				setupAutoPlayMethod();
			});
			player.addEventListener('wikiaEmptyAd', () => {
				viewportListenerId = Porvata.addOnViewportChangeListener(params, () => {
					player.dispatchEvent('wikiaFirstTimeInViewport');
					utils.viewportObserver.removeListener(viewportListenerId);
				});
			});

			return player;
		});
	}

	static isVpaid(contentType: string): boolean {
		return contentType === 'application/javascript';
	}

	static isVideoAutoplaySupported(): boolean {
		const isAndroid: boolean = utils.client.getOperatingSystem() === 'Android';
		const browser: string[] = utils.client.getBrowser().split(' ');
		const isCompatibleChrome: boolean =
			browser[0].indexOf('Chrome') !== -1 && parseInt(browser[1], 10) >= 54;

		return !isAndroid || isCompatibleChrome;
	}
}
