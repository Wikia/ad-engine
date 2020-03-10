import { AdSlot, Dictionary, utils } from '@ad-engine/core';
import { GoogleImaWrapper } from './google-ima-wrapper';
import { NativeFullscreen } from './native-fullscreen';
import { PorvataDom } from './porvata-dom';
import { PorvataSettings } from './porvata-settings';

type VideoEvent = google.ima.AdEvent.Type | google.ima.AdErrorEvent.Type | string;
type VideoState = 'playing' | 'paused' | 'stopped';

const VIDEO_FULLSCREEN_CLASS_NAME = 'video-player-fullscreen';
const STOP_SCROLLING_CLASS_NAME = 'stop-scrolling';

export const DEFAULT_VOLUME = 0.75;
export const DEFAULT_VIDEO_ASPECT_RATIO = 640 / 360;
export const FLOATING_VIDEO_ASPECT_RATIO = 640 / 480;

export class PorvataPlayer {
	/**
	 * @deprecated
	 * It's used in old PorvataListener only
	 */
	container: HTMLElement;
	// TODO: Consider better place for isFloating flag
	isFloating = false;

	private state: VideoState = null;
	private adsManager: google.ima.AdsManager = null;
	private eventListeners: Dictionary<((...args: any[]) => void)[]> = {};
	private fullscreenMuteProtect: boolean;

	readonly dom: PorvataDom;
	readonly nativeFullscreen: NativeFullscreen;
	readonly destroyCallbacks = new utils.LazyQueue();

	constructor(
		private readonly adDisplayContainer: google.ima.AdDisplayContainer,
		private readonly adsLoader: google.ima.AdsLoader,
		private readonly adsRequest: google.ima.AdsRequest,
		readonly settings: PorvataSettings,
	) {
		const playerContainer = settings.getPlayerContainer();

		this.dom = new PorvataDom(playerContainer);
		this.container = playerContainer;
		this.nativeFullscreen = new NativeFullscreen(playerContainer);

		this.registerStateListeners();

		if (this.settings.isAutoPlay()) {
			this.setAutoPlay(true);
		}

		this.destroyCallbacks.onItemFlush((callback: () => void) => callback());

		if (this.nativeFullscreen.isSupported()) {
			this.nativeFullscreen.addChangeListener(() => this.onFullscreenChange());
		}
	}

	private registerStateListeners(): void {
		this.addEventListener(window.google.ima.AdEvent.Type.LOADED, (event: google.ima.AdEvent) =>
			this.setAdStatus(AdSlot.STATUS_SUCCESS, event.getAd()),
		);
		this.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, () =>
			this.setAdStatus(AdSlot.STATUS_ERROR),
		);

		this.addEventListener('resume', () => this.setState('playing'));
		this.addEventListener('start', () => this.setState('playing'));
		this.addEventListener('pause', () => this.setState('paused'));
		this.addEventListener('wikiaAdStop', () => this.setState('stopped'));
		this.addEventListener('allAdsCompleted', () => this.setState('stopped'));

		this.addEventListener('adCanPlay', () =>
			this.dom.getInterfaceContainer().classList.remove('hide'),
		);
		this.addEventListener('wikiaAdCompleted', () =>
			this.dom.getInterfaceContainer().classList.add('hide'),
		);
	}

	getAdsManager(): google.ima.AdsManager | null {
		return this.adsManager;
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

	/**
	 * @deprecated this method is not implemented
	 *
	 * intentionally empty for now - needed only to create a stream with RxJS `fromEvent`
	 */
	removeEventListener(
		eventName: VideoEvent,
		callback: (event: google.ima.AdEvent | google.ima.AdErrorEvent) => void,
	): void {
		// TODO: Implement removeEventListener
	}

	dispatchEvent(eventName: string): void {
		if (this.eventListeners[eventName] && this.eventListeners[eventName].length > 0) {
			this.eventListeners[eventName].forEach((callback) => {
				callback({});
			});
		}
	}

	setAutoPlay(value: boolean): void {
		this.dom.setAutoPlayOnVideoElement(value);
		this.settings.setAutoPlay(value);
	}

	setAdStatus(status: string, currentAd?: google.ima.Ad) {
		this.dom.setVastAttributes(this.adsRequest.adTagUrl, status, currentAd);
	}

	requestAds(): void {
		this.adsLoader.requestAds(this.adsRequest);
	}

	play(width?: number, height?: number): void {
		if (width !== undefined && height !== undefined) {
			this.settings.setHeight(height);
			this.settings.setWidth(width);
		}
		if (!this.settings.getWidth() || !this.settings.getHeight() || this.isFullscreen()) {
			this.settings.setHeight(this.dom.getPlayerContainer().offsetHeight);
			this.settings.setWidth(this.dom.getPlayerContainer().offsetWidth);
		}

		this.dispatchEvent('wikiaAdPlayTriggered');

		// https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer.initialize
		this.adDisplayContainer.initialize();
		this.adsManager.init(
			Math.round(this.settings.getWidth()),
			Math.round(this.settings.getHeight()),
			window.google.ima.ViewMode.NORMAL,
		);
		this.adsManager.start();
	}

	reload(): void {
		const adsRequest = GoogleImaWrapper.createAdsRequest(this.settings);

		this.adsManager.destroy();
		this.adsLoader.contentComplete();
		this.adsLoader.requestAds(adsRequest);
	}

	resize(width?: number, height?: number): void {
		const viewMode: typeof google.ima.ViewMode = window.google.ima.ViewMode;

		if (isFinite(width) && isFinite(height)) {
			this.settings.setHeight(height);
			this.settings.setWidth(width);
		}

		if (!!this.adsManager) {
			if (this.isFullscreen()) {
				this.adsManager.resize(window.innerWidth, window.innerHeight, viewMode.FULLSCREEN);
			} else {
				this.adsManager.resize(
					Math.round(this.settings.getWidth()),
					Math.round(this.settings.getHeight()),
					viewMode.NORMAL,
				);
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
		this.setVolume(DEFAULT_VOLUME);

		if (this.settings.isAutoPlay() && this.settings.shouldRestartOnMute()) {
			this.rewind();
		}
	}

	setVolume(volume: number): void {
		this.dom.setAudioOnVideoElement(volume);
		this.adsManager.setVolume(volume);

		// This is hack for Safari, because it can't dispatch original IMA event (volumeChange)
		this.dispatchEvent('wikiaVolumeChange');
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
			this.dom.getPlayerContainer().classList.add(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.add(STOP_SCROLLING_CLASS_NAME);
		} else {
			this.dom.getPlayerContainer().classList.remove(VIDEO_FULLSCREEN_CLASS_NAME);
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
