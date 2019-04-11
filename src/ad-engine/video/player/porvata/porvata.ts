import { PorvataListener } from '../../../listeners';
import { client, LazyQueue, tryProperty, viewportObserver, whichProperty } from '../../../utils';
import { googleIma } from './ima/google-ima';
import { GoogleImaPlayer } from './ima/google-ima-player-factory';
import { VideoParams, VideoSettings } from './video-settings';

export interface VastTargeting {
	passback: string;
}

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
	vastTargeting: VastTargeting;
	blockOutOfViewportPausing: boolean;
	startInViewportOnly: boolean;
	onReady: (player: PorvataPlayer) => void;
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

const prepareVideoAdContainer = (params) => {
	const videoAdContainer = params.container.querySelector('div');

	videoAdContainer.classList.add('video-player');
	videoAdContainer.classList.add('hide');

	return videoAdContainer;
};

const nativeFullscreenOnElement = (element) => {
	const enter = tryProperty(element, [
		'webkitRequestFullscreen',
		'mozRequestFullScreen',
		'msRequestFullscreen',
		'requestFullscreen',
	]);
	const exit = tryProperty(document, [
		'webkitExitFullscreen',
		'mozCancelFullScreen',
		'msExitFullscreen',
		'exitFullscreen',
	]);
	const fullscreenChangeEvent = (
		whichProperty(document, [
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
	readonly destroyCallbacks = new LazyQueue();
	nativeFullscreen: NativeFullscreen;

	constructor(
		readonly ima: GoogleImaPlayer,
		private params: VideoParams,
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

	updateVideoDOMElement(volume): void {
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

export class Porvata {
	private static addOnViewportChangeListener(
		params: PorvataTemplateParams,
		listener: (isVisible: boolean) => void,
	): string {
		return viewportObserver.addListener(params.viewportHookElement || params.container, listener, {
			offsetTop: params.viewportOffsetTop || 0,
			offsetBottom: params.viewportOffsetBottom || 0,
		});
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
		let viewportListenerId = null;

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

		return googleIma
			.load()
			.then(() => googleIma.getPlayer(videoSettings))
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
				});
				video.addEventListener('allAdsCompleted', () => {
					if (video.isFullscreen()) {
						video.toggleFullscreen();
					}

					video.ima.setAutoPlay(false);
					video.ima.dispatchEvent('wikiaAdCompleted');
					if (viewportListenerId) {
						viewportObserver.removeListener(viewportListenerId);
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
						viewportObserver.removeListener(viewportListenerId);
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
						viewportObserver.removeListener(viewportListenerId);
					});
				});

				return video;
			});
	}

	static isVpaid(contentType: string): boolean {
		return contentType === 'application/javascript';
	}

	static isVideoAutoplaySupported(): boolean {
		const isAndroid: boolean = client.getOperatingSystem() === 'Android';
		const browser: string[] = client.getBrowser().split(' ');
		const isCompatibleChrome: boolean =
			browser[0].indexOf('Chrome') !== -1 && parseInt(browser[1], 10) >= 54;

		return !isAndroid || isCompatibleChrome;
	}
}
