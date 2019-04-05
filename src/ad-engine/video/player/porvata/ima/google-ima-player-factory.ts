import { Dictionary } from '../../../../models';
import { vastDebugger } from '../../../vast-debugger';
import { moatVideoTracker } from '../moat/moat-video-tracker';
import { VideoParams, VideoSettings } from '../video-settings';
import { googleImaSetup } from './google-ima-setup';

type VideoEvent = google.ima.AdEvent.Type | string;

function getVideoElement(): HTMLVideoElement {
	const videoElement: HTMLVideoElement = document.createElement('video');

	videoElement.setAttribute('preload', 'none');

	return videoElement;
}

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
		private params: VideoParams, // TODO: Add type
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

	setVastAttributes(status: string): void {
		const currentAd: google.ima.Ad =
			this.adsManager && this.adsManager.getCurrentAd && this.adsManager.getCurrentAd();
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

export const googleImaPlayerFactory = {
	create(
		adDisplayContainer: google.ima.AdDisplayContainer,
		adsLoader: google.ima.AdsLoader,
		videoSettings: VideoSettings,
	): GoogleImaPlayer {
		const adRequest = googleImaSetup.createRequest(videoSettings.getParams());
		const player = new GoogleImaPlayer(adDisplayContainer, adsLoader, videoSettings.getParams());
		const videoElement: HTMLVideoElement = getVideoElement();

		if (player.videoAd) {
			const container: HTMLElement | undefined = videoSettings.getContainer();

			player.videoAd.classList.add('porvata-video');
			if (!!container) {
				container.classList.add('porvata');
			}
		}

		adsLoader.addEventListener(
			window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
			(adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) => {
				const renderingSettings = googleImaSetup.getRenderingSettings(videoSettings);
				const adsManager: google.ima.AdsManager = adsManagerLoadedEvent.getAdsManager(
					videoElement,
					renderingSettings,
				);

				player.setAdsManager(adsManager);

				if (videoSettings.isMoatTrackingEnabled()) {
					moatVideoTracker.init(
						adsManager,
						videoSettings.getContainer(),
						window.google.ima.ViewMode.NORMAL,
						videoSettings.get('src'),
						`${videoSettings.get('adProduct')}/${videoSettings.get('slotName')}`,
					);
				}

				player.dispatchEvent('wikiaAdsManagerLoaded');

				adsManager.addEventListener(window.google.ima.AdEvent.Type.LOADED, () =>
					player.setVastAttributes('success'),
				);
				adsManager.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, () =>
					player.setVastAttributes('error'),
				);
			},
			false,
		);

		adsLoader.addEventListener(
			window.google.ima.AdErrorEvent.Type.AD_ERROR,
			(event: google.ima.AdErrorEvent) => {
				const emptyVastErrorCode = window.google.ima.AdError.ErrorCode.VAST_EMPTY_RESPONSE;

				if (
					typeof event.getError === 'function' &&
					event.getError().getErrorCode() === emptyVastErrorCode
				) {
					player.dispatchEvent('wikiaEmptyAd');
				}

				player.setVastAttributes('error');
			},
		);

		player.setVastUrl(adRequest.adTagUrl);
		adsLoader.requestAds(adRequest);
		if (videoSettings.get('autoPlay')) {
			player.setAutoPlay(true);
		}

		player.addEventListener('resume', player.setStatus('playing'));
		player.addEventListener('start', player.setStatus('playing'));
		player.addEventListener('pause', player.setStatus('paused'));
		player.addEventListener('wikiaAdStop', player.setStatus('stopped'));
		player.addEventListener('allAdsCompleted', player.setStatus('stopped'));

		return player;
	},
};
