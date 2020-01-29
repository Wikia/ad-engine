import { AdSlot, Dictionary, utils, vastDebugger } from '@ad-engine/core';
import { GoogleImaWrapper } from './google-ima-wrapper';
import { NativeFullscreen } from './native-fullscreen';
import { VideoSettings } from './video-settings';

type VideoEvent = google.ima.AdEvent.Type | google.ima.AdErrorEvent.Type | string;
type VideoState = 'playing' | 'paused' | 'stopped';

const VIDEO_FULLSCREEN_CLASS_NAME = 'video-player-fullscreen';
const STOP_SCROLLING_CLASS_NAME = 'stop-scrolling';

export class PorvataPlayer {
	isFloating = false; // TODO REMOVE ME

	private state: VideoState = null;
	private adsManager: google.ima.AdsManager = null;
	private eventListeners: Dictionary<((...args: any[]) => void)[]> = {};
	private width: number;
	private height: number;
	private fullscreenMuteProtect: boolean;

	readonly nativeFullscreen: NativeFullscreen;
	readonly defaultVolume = 0.75;
	readonly destroyCallbacks = new utils.LazyQueue();
	readonly playerContainer: HTMLElement | null = null;
	readonly interfaceContainer: HTMLElement | null = null;
	readonly videoContainer: HTMLElement | null = null;
	readonly videoElement: HTMLVideoElement | null = null;

	constructor(
		private adDisplayContainer: google.ima.AdDisplayContainer,
		private adsLoader: google.ima.AdsLoader,
		private adsRequest: google.ima.AdsRequest,
		public videoSettings: VideoSettings,
	) {
		this.playerContainer = videoSettings.getContainer();
		this.playerContainer.classList.add('porvata', 'porvata-container');

		this.videoContainer = this.playerContainer.querySelector('div');
		this.videoContainer.classList.add('video-player', 'porvata-player', 'hide');

		this.videoElement = this.playerContainer.querySelector('video');
		this.videoElement.classList.add('porvata-video');

		this.interfaceContainer = document.createElement('div');
		this.interfaceContainer.classList.add('porvata-interface', 'hide');
		this.playerContainer.appendChild(this.interfaceContainer);

		this.registerStateListeners();

		if (this.videoSettings.isAutoPlay()) {
			this.setAutoPlay(true);
		}

		this.nativeFullscreen = new NativeFullscreen(this.videoContainer);
		this.width = this.videoSettings.get('width');
		this.height = this.videoSettings.get('height');

		this.destroyCallbacks.onItemFlush((callback: () => void) => callback());

		if (this.nativeFullscreen.isSupported()) {
			this.nativeFullscreen.addChangeListener(() => this.onFullscreenChange());
		}
	}

	private registerStateListeners(): void {
		this.addEventListener(window.google.ima.AdEvent.Type.LOADED, (event: google.ima.AdEvent) =>
			this.setVastAttributes(AdSlot.STATUS_SUCCESS, event.getAd()),
		);
		this.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, () =>
			this.setVastAttributes(AdSlot.STATUS_ERROR),
		);

		this.addEventListener('resume', () => this.setState('playing'));
		this.addEventListener('start', () => this.setState('playing'));
		this.addEventListener('pause', () => this.setState('paused'));
		this.addEventListener('wikiaAdStop', () => this.setState('stopped'));
		this.addEventListener('allAdsCompleted', () => this.setState('stopped'));

		this.addEventListener('adCanPlay', () => this.interfaceContainer.classList.remove('hide'));
		this.addEventListener('wikiaAdCompleted', () => this.interfaceContainer.classList.add('hide'));
	}

	setAdsManager(adsManager: google.ima.AdsManager): void {
		this.adsManager = adsManager;
	}

	addEventListener(
		eventName: VideoEvent,
		callback: (event: google.ima.AdEvent | google.ima.AdErrorEvent) => void,
	): void {
		if ((eventName as string).indexOf('wikia') !== -1) {
			this.eventListeners[eventName] = this.eventListeners[eventName] || [];
			this.eventListeners[eventName].push(callback);

			return;
		}

		if (this.adsManager !== null) {
			this.adsManager.addEventListener(eventName as google.ima.AdEvent.Type, callback);
		} else {
			this.addEventListener('wikiaAdsManagerLoaded', () =>
				this.adsManager.addEventListener(eventName as google.ima.AdEvent.Type, callback),
			);
		}
	}

	dispatchEvent(eventName: string): void {
		if (this.eventListeners[eventName] && this.eventListeners[eventName].length > 0) {
			this.eventListeners[eventName].forEach((callback) => {
				callback({});
			});
		}
	}

	setVastAttributes(status: string, currentAd?: google.ima.Ad): void {
		const attributes = vastDebugger.getVastAttributes(this.adsRequest.adTagUrl, status, currentAd);

		Object.keys(attributes).forEach((key) =>
			this.videoContainer.setAttribute(key, attributes[key]),
		);
	}

	setAutoPlay(value: boolean): void {
		if (this.videoElement) {
			this.videoElement.autoplay = value;
			this.videoElement.muted = value;
		}

		this.videoSettings.setAutoPlay(value);
	}

	requestAds(): void {
		this.adsLoader.requestAds(this.adsRequest);
	}

	play(width?: number, height?: number): void {
		if (width !== undefined && height !== undefined) {
			this.width = width;
			this.height = height;
		}
		if (!this.width || !this.height || this.isFullscreen()) {
			this.width = this.playerContainer.offsetWidth;
			this.height = this.playerContainer.offsetHeight;
		}

		this.dispatchEvent('wikiaAdPlayTriggered');

		setTimeout(() => this.pause(), 5000);

		// https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer.initialize
		this.adDisplayContainer.initialize();
		this.adsManager.init(
			Math.round(this.width),
			Math.round(this.height),
			window.google.ima.ViewMode.NORMAL,
		);
		this.adsManager.start();
	}

	reload(): void {
		const adsRequest = GoogleImaWrapper.createAdsRequest(this.videoSettings);

		this.adsManager.destroy();
		this.adsLoader.contentComplete();
		this.adsLoader.requestAds(adsRequest);
	}

	resize(width?: number, height?: number): void {
		const viewMode: typeof google.ima.ViewMode = window.google.ima.ViewMode;

		if (!!this.adsManager) {
			if (isFinite(width) && isFinite(height)) {
				this.width = width;
				this.height = height;
			}

			if (this.isFullscreen()) {
				this.adsManager.resize(window.innerWidth, window.innerHeight, viewMode.FULLSCREEN);
			} else {
				this.adsManager.resize(Math.round(this.width), Math.round(this.height), viewMode.NORMAL);
			}
		}
	}

	getRemainingTime(): number {
		return this.adsManager.getRemainingTime();
	}

	setState(state: VideoState): void {
		this.state = state;
	}

	getState(): VideoState {
		return this.state;
	}

	isPaused(): boolean {
		return this.getState() === 'paused';
	}

	isPlaying(): boolean {
		return this.getState() === 'playing';
	}

	resume(): void {
		this.adsManager.resume();
	}

	rewind(): void {
		this.setAutoPlay(false);
		this.dispatchEvent('wikiaAdRestart');
		this.play();
	}

	pause(): void {
		this.adsManager.pause();
	}

	stop(): void {
		this.adsManager.stop();
		this.dispatchEvent('wikiaAdStop');
	}

	toggleVolume(): void {
		if (this.isMuted()) {
			this.unmute();
			this.dispatchEvent('wikiaAdUnmute');
		} else {
			this.mute();
			this.dispatchEvent('wikiaAdMute');
		}
	}

	isMuted(): boolean {
		return this.adsManager.getVolume() === 0;
	}

	mute(): void {
		this.setVolume(0);
	}

	unmute(): void {
		this.setVolume(this.defaultVolume);

		if (this.videoSettings.isAutoPlay() && this.videoSettings.get('restartOnUnmute')) {
			this.rewind();
		}
	}

	setVolume(volume: number): void {
		this.updateVideoElementAudioProperties(volume);
		this.adsManager.setVolume(volume);

		// This is hack for Safari, because it can't dispatch original IMA event (volumeChange)
		this.dispatchEvent('wikiaVolumeChange');
	}

	private updateVideoElementAudioProperties(volume: number): void {
		if (this.videoElement) {
			this.videoElement.muted = volume === 0;
			this.videoElement.volume = volume;
		}
	}

	toggleFullscreen(): void {
		this.fullscreenMuteProtect = true;

		if (this.nativeFullscreen.isSupported()) {
			this.nativeFullscreen.toggle();
		} else {
			this.onFullscreenChange();
		}
	}

	private onFullscreenChange(): void {
		if (this.isFullscreen()) {
			this.videoContainer.classList.add(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.add(STOP_SCROLLING_CLASS_NAME);
		} else {
			this.videoContainer.classList.remove(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.remove(STOP_SCROLLING_CLASS_NAME);

			if (this.fullscreenMuteProtect) {
				this.fullscreenMuteProtect = false;
			} else if (this.isPlaying() && !this.isMuted()) {
				this.mute();
			}
		}

		this.resize();
		this.dispatchEvent('wikiaFullscreenChange');
	}

	isFullscreen(): boolean {
		return this.nativeFullscreen.isFullscreen();
	}

	addOnDestroyCallback(callback: () => void): void {
		this.destroyCallbacks.push(callback);
	}

	destroy(): void {
		this.destroyCallbacks.flush();
	}
}
