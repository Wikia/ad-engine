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
import { PorvataFactory } from './porvata-factory';
import { PorvataListener } from './porvata-listener';
import { PorvataPlayer } from './porvata-player';
import { VideoSettings } from './video-settings';

export interface PorvataTemplateParams {
	vpaidMode: google.ima.ImaSdkSettings.VpaidMode;
	viewportHookElement?: HTMLElement;
	container: HTMLElement;
	originalContainer: HTMLElement;
	enableInContentFloating: boolean;
	slotName: string;
	viewportOffsetTop?: number;
	viewportOffsetBottom?: number;
	adProduct: string;
	src: string;
	autoPlay: boolean;
	vastTargeting: Targeting;
	blockOutOfViewportPausing: boolean;
	startInViewportOnly: boolean;
	onReady: (player: PorvataPlayer) => void;
}

export interface PorvataGamParams {
	container: HTMLElement;
	slotName: string;
	type: string;
	theme: string;
	adProduct: string;
	autoPlay: boolean;
	startInViewportOnly: boolean;
	blockOutOfViewportPausing: boolean;
	enableInContentFloating: boolean;
	width: number;
	height: number;
	src: string;
	lineItemId: string;
	creativeId: string;
	trackingDisabled: boolean;
	loadVideoTimeout: number;
	vpaidMode: google.ima.ImaSdkSettings.VpaidMode;
	vastTargeting: Targeting;
}

export const VpaidMode = {
	DISABLED: 0,
	ENABLED: 1,
	INSECURE: 2,
};

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
			passback: 'veles',
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
			video.addEventListener('loaded', () => {
				if (isFirstPlay) {
					video.mute();
				}
			});
		}

		params.vastTargeting = params.vastTargeting || {
			passback: 'porvata',
		};

		const videoSettings = new VideoSettings(params);

		porvataListener.init();

		return PorvataFactory.create(videoSettings).then((player: PorvataPlayer) => {
			// setTimeout(() => player.pause(), 5000);
			// (window as any).video = player;

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
