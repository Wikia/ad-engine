import { Dictionary } from '../../../../models';
import { vastDebugger } from '../../../vast-debugger';
import { VideoParams } from '../video-settings';
import { googleImaSetup } from './google-ima-setup';

type VideoEvent = google.ima.AdEvent.Type | string;

export class GoogleImaPlayer {
	status = '';
	isAdsManagerLoaded = false;
	adsManager: google.ima.AdsManager = null;
	eventListeners: Dictionary<((...args: any[]) => void)[]> = {};
	vastUrl = '';
	videoAd: HTMLVideoElement;

	constructor(
		private adDisplayContainer: google.ima.AdDisplayContainer,
		private adsLoader: google.ima.AdsLoader,
		private params: VideoParams,
	) {
		this.videoAd = params.container.querySelector('video');
	}

	setVastUrl(vastUrl: string): void {
		this.vastUrl = vastUrl;
	}

	setAdsManager(adsManager: google.ima.AdsManager): void {
		this.adsManager = adsManager;
		this.isAdsManagerLoaded = true;
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

		if (this.isAdsManagerLoaded) {
			this.adsManager.addEventListener(eventName as google.ima.AdEvent.Type, callback);
		} else {
			this.adsLoader.addEventListener(
				window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
				() => this.adsManager.addEventListener(eventName as google.ima.AdEvent.Type, callback),
			);
		}
	}

	setVastAttributes(status: string, currentAd?: google.ima.Ad): void {
		const playerElement: HTMLVideoElement = this.params.container.querySelector('.video-player');

		vastDebugger.setVastAttributes(playerElement, this.vastUrl, status, currentAd);
	}

	setAutoPlay(value: boolean): void {
		if (this.videoAd) {
			this.videoAd.autoplay = value;
			this.videoAd.muted = value;
		}
		this.params.autoPlay = value;
	}

	playVideo(width: number, height: number): void {
		const callback = () => {
			this.dispatchEvent('wikiaAdPlayTriggered');
			// https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer.initialize
			this.adDisplayContainer.initialize();
			this.adsManager.init(
				Math.round(width),
				Math.round(height),
				window.google.ima.ViewMode.NORMAL,
			);
			this.adsManager.start();
			this.adsLoader.removeEventListener(
				window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
				callback,
			);
		};

		if (this.isAdsManagerLoaded) {
			callback();
		} else {
			// When adsManager is not loaded yet video can't start without click on mobile
			// Muted auto play is workaround to run video on adsManagerLoaded event
			this.setAutoPlay(true);
			this.adsLoader.addEventListener(
				window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
				callback,
				false,
			);
		}
	}

	reload(): void {
		const adRequest = googleImaSetup.createRequest(this.params);

		this.adsManager.destroy();
		this.adsLoader.contentComplete();
		this.setVastUrl(adRequest.adTagUrl);
		this.adsLoader.requestAds(adRequest);
	}

	resize(width: number, height: number, isFullscreen = false): void {
		const viewMode: typeof google.ima.ViewMode = window.google.ima.ViewMode;

		if (!!this.adsManager) {
			this.adsManager.resize(
				Math.round(width),
				Math.round(height),
				isFullscreen ? viewMode.FULLSCREEN : viewMode.NORMAL,
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

	setStatus(newStatus: string): () => void {
		return () => {
			this.status = newStatus;
		};
	}

	getStatus(): string {
		return this.status;
	}

	getAdsManager(): google.ima.AdsManager | null {
		return this.adsManager;
	}
}
