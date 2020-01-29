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
import { GoogleIma } from './ima/google-ima';
import { GoogleImaPlayer } from './ima/google-ima-player';
import { PorvataListener } from './porvata-listener';
import { VideoParams, VideoSettings } from './video-settings';

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

interface NativeFullscreen {
	enter: () => boolean | undefined;
	exit: () => boolean | undefined;
	addChangeListener: (listener: () => void) => void;
	removeChangeListener: (listener: () => void) => void;
	isSupported: () => boolean;
}

const VIDEO_FULLSCREEN_CLASS_NAME = 'video-player-fullscreen';
const STOP_SCROLLING_CLASS_NAME = 'stop-scrolling';

export const VpaidMode = {
	DISABLED: 0,
	ENABLED: 1,
	INSECURE: 2,
};

const prepareVideoAdContainer = (params: VideoParams): HTMLElement => {
	const videoAdContainer = params.container.querySelector('div');

	videoAdContainer.classList.add('video-player');
	videoAdContainer.classList.add('hide');

	return videoAdContainer;
};

const nativeFullscreenOnElement = (element: HTMLElement): NativeFullscreen => {
	const enter = utils.tryProperty(element, [
		'webkitRequestFullscreen',
		'mozRequestFullScreen',
		'msRequestFullscreen',
		'requestFullscreen',
	]);
	const exit = utils.tryProperty(document, [
		'webkitExitFullscreen',
		'mozCancelFullScreen',
		'msExitFullscreen',
		'exitFullscreen',
	]);
	const fullscreenChangeEvent = (
		utils.whichProperty(document, [
			'onwebkitfullscreenchange',
			'onmozfullscreenchange',
			'onmsfullscreenchange',
			'onfullscreenchange',
		]) || ''
	)
		.replace(/^on/, '')
		.replace('msfullscreenchange', 'MSFullscreenChange');
	const addChangeListener = (listener: () => void) =>
		document.addEventListener(fullscreenChangeEvent, listener);
	const removeChangeListener = (listener: () => void) =>
		document.removeEventListener(fullscreenChangeEvent, listener);
	const isSupported = () => Boolean(enter && exit);

	return {
		enter,
		exit,
		addChangeListener,
		removeChangeListener,
		isSupported,
	} as NativeFullscreen;
};

export class PorvataPlayer {
	container: HTMLElement;
	mobileVideoAd: HTMLVideoElement;
	isFloating = false;
	fullscreen: boolean;
	width: number;
	height: number;
	muteProtect: boolean;
	readonly defaultVolume = 0.75;
	readonly destroyCallbacks = new utils.LazyQueue();
	nativeFullscreen: NativeFullscreen;

	constructor(
		readonly ima: GoogleImaPlayer,
		public params: VideoParams,
		public videoSettings: VideoSettings,
	) {
		this.container = prepareVideoAdContainer(params);
		this.mobileVideoAd = params.container.querySelector('video');

		const nativeFullscreen: NativeFullscreen = nativeFullscreenOnElement(this.container);

		this.fullscreen = Boolean(params.isFullscreen);
		this.nativeFullscreen = nativeFullscreen;
		this.width = params.width;
		this.height = params.height;

		this.destroyCallbacks.onItemFlush((callback: () => void) => callback());

		if (nativeFullscreen.isSupported()) {
			nativeFullscreen.addChangeListener(() => this.onFullscreenChange());
		}
	}

	addEventListener(
		eventName: string,
		callback: (event: google.ima.AdErrorEvent | google.ima.AdEvent) => void,
	): void {
		this.ima.addEventListener(eventName, callback);
	}

	getRemainingTime(): number {
		return this.ima.getAdsManager().getRemainingTime();
	}

	isFullscreen(): boolean {
		return this.fullscreen;
	}

	isMuted(): boolean {
		return this.ima.getAdsManager().getVolume() === 0;
	}

	isMobilePlayerMuted(): boolean {
		const mobileVideoAd = this.container.querySelector<HTMLVideoElement>('video');

		return mobileVideoAd && mobileVideoAd.autoplay && mobileVideoAd.muted;
	}

	isPaused(): boolean {
		return this.ima.getStatus() === 'paused';
	}

	isPlaying(): boolean {
		return this.ima.getStatus() === 'playing';
	}

	pause(): void {
		this.ima.getAdsManager().pause();
	}

	play(newWidth?: number, newHeight?: number): void {
		if (newWidth !== undefined && newHeight !== undefined) {
			this.width = newWidth;
			this.height = newHeight;
		}
		if (!this.width || !this.height || this.isFullscreen()) {
			this.width = this.params.container.offsetWidth;
			this.height = this.params.container.offsetHeight;
		}

		this.ima.playVideo(this.width, this.height);
	}

	reload(): void {
		this.ima.reload();
	}

	resize(newWidth?: number, newHeight?: number): void {
		if (isFinite(newWidth) && isFinite(newHeight)) {
			this.width = newWidth;
			this.height = newHeight;
		}

		if (this.isFullscreen()) {
			this.ima.resize(window.innerWidth, window.innerHeight, true);
		} else {
			this.ima.resize(this.width, this.height, false);
		}
	}

	resume(): void {
		this.ima.getAdsManager().resume();
	}

	rewind(): void {
		this.params.autoPlay = false;
		this.ima.setAutoPlay(false);
		this.ima.dispatchEvent('wikiaAdRestart');
		this.play();
	}

	setVolume(volume: number): void {
		this.updateVideoDOMElement(volume);
		this.ima.getAdsManager().setVolume(volume);

		// This is hack for Safari, because it can't dispatch original IMA event (volumeChange)
		this.ima.dispatchEvent('wikiaVolumeChange');
	}

	toggleFullscreen(): void {
		const isFullscreen: boolean = this.isFullscreen();

		this.muteProtect = true;

		if (this.nativeFullscreen.isSupported()) {
			const toggleNativeFullscreen = isFullscreen
				? this.nativeFullscreen.exit
				: this.nativeFullscreen.enter;

			toggleNativeFullscreen();
		} else {
			this.onFullscreenChange();
		}
	}

	onFullscreenChange(): void {
		this.fullscreen = !this.fullscreen;

		if (this.isFullscreen()) {
			this.container.classList.add(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.add(STOP_SCROLLING_CLASS_NAME);
		} else {
			this.container.classList.remove(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.remove(STOP_SCROLLING_CLASS_NAME);

			if (this.muteProtect) {
				this.muteProtect = false;
			} else if (this.isPlaying() && !this.isMuted()) {
				this.mute();
			}
		}

		this.resize();
		this.ima.dispatchEvent('wikiaFullscreenChange');
	}

	updateVideoDOMElement(volume: number): void {
		if (this.mobileVideoAd) {
			this.mobileVideoAd.muted = volume === 0;
			this.mobileVideoAd.volume = volume;
		}
	}

	mute(): void {
		this.setVolume(0);
	}

	unmute(): void {
		this.setVolume(this.defaultVolume);

		if (this.params.autoPlay && this.params.restartOnUnmute) {
			this.rewind();
		}
	}

	volumeToggle(): void {
		if (this.isMuted()) {
			this.unmute();
			this.ima.dispatchEvent('wikiaAdUnmute');
		} else {
			this.mute();
			this.ima.dispatchEvent('wikiaAdMute');
		}
	}

	stop(): void {
		this.ima.getAdsManager().stop();
		this.ima.dispatchEvent('wikiaAdStop');
	}

	addOnDestroyCallback(callback: () => void): void {
		this.destroyCallbacks.push(callback);
	}

	destroy(): void {
		this.destroyCallbacks.flush();
	}
}

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

		return GoogleIma.init()
			.then((googleIma) => googleIma.getPlayer(videoSettings))
			.then((ima: GoogleImaPlayer) => new PorvataPlayer(ima, params, videoSettings))
			.then((video: PorvataPlayer) => {
				function inViewportCallback(isVisible: boolean): void {
					// Play video automatically only for the first time
					if (isVisible && !autoPlayed && params.autoPlay) {
						video.ima.dispatchEvent('wikiaFirstTimeInViewport');
						video.play();
						autoPlayed = true;
						// Don't resume when video was paused manually
					} else if (isVisible && autoPaused) {
						video.resume();
						// Pause video once it's out of viewport and set autoPaused to distinguish manual
						// and auto pause
					} else if (!isVisible && video.isPlaying() && !params.blockOutOfViewportPausing) {
						video.pause();
						autoPaused = true;
					}
				}

				function setupAutoPlayMethod(): void {
					if (params.blockOutOfViewportPausing && !params.startInViewportOnly) {
						if (params.autoPlay && !autoPlayed) {
							autoPlayed = true;
							video.play();
						}
					} else {
						viewportListenerId = Porvata.addOnViewportChangeListener(params, inViewportCallback);
					}
				}

				porvataListener.registerVideoEvents(video);

				video.addEventListener('adCanPlay', () => {
					video.ima.dispatchEvent('wikiaAdStarted');
					eventService.emit(events.VIDEO_AD_IMPRESSION, slotService.get(params.slotName));
				});
				video.addEventListener('allAdsCompleted', () => {
					if (video.isFullscreen()) {
						video.toggleFullscreen();
					}

					video.ima.setAutoPlay(false);
					video.ima.dispatchEvent('wikiaAdCompleted');
					if (viewportListenerId) {
						utils.viewportObserver.removeListener(viewportListenerId);
						viewportListenerId = null;
					}
					isFirstPlay = false;
					porvataListener.params.withAudio = true;
					porvataListener.params.withCtp = true;
				});
				video.addEventListener('wikiaAdRestart', () => {
					isFirstPlay = false;
				});
				video.addEventListener('start', () => {
					video.ima.dispatchEvent('wikiaAdPlay');
					if (!viewportListenerId && !autoPlayed) {
						setupAutoPlayMethod();
					}
				});
				video.addEventListener('resume', () => {
					video.ima.dispatchEvent('wikiaAdPlay');
					autoPaused = false;
				});
				video.addEventListener('pause', () => {
					video.ima.dispatchEvent('wikiaAdPause');
				});
				video.addOnDestroyCallback(() => {
					if (viewportListenerId) {
						utils.viewportObserver.removeListener(viewportListenerId);
						viewportListenerId = null;
					}
				});

				if (params.autoPlay) {
					muteFirstPlay(video);
				}

				if (params.onReady) {
					params.onReady(video);
				}

				video.addEventListener('wikiaAdsManagerLoaded', () => {
					setupAutoPlayMethod();
				});
				video.addEventListener('wikiaEmptyAd', () => {
					viewportListenerId = Porvata.addOnViewportChangeListener(params, () => {
						video.ima.dispatchEvent('wikiaFirstTimeInViewport');
						utils.viewportObserver.removeListener(viewportListenerId);
					});
				});

				return video;
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
