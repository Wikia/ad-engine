import { vastDebugger } from '../../../vast-debugger';
import { moatVideoTracker } from '../moat/moat-video-tracker';
import { googleImaSetup } from './google-ima-setup';

function getVideoElement() {
	const videoElement = document.createElement('video');

	videoElement.setAttribute('preload', 'none');

	return videoElement;
}

class GoogleImaPlayer {
	constructor(adDisplayContainer, adsLoader, params) {
		this.isAdsManagerLoaded = false;
		this.status = '';
		this.adDisplayContainer = adDisplayContainer;
		this.adsLoader = adsLoader;
		this.adsManager = null;
		this.params = params;
		this.videoAd = params.container.querySelector('video');
		this.eventListeners = {};
		this.vastUrl = '';
	}

	setVastUrl(vastUrl) {
		this.vastUrl = vastUrl;
	}

	setAdsManager(adsManager) {
		this.adsManager = adsManager;
		this.isAdsManagerLoaded = true;
	}

	addEventListener(eventName, callback) {
		if (eventName.indexOf('wikia') !== -1) {
			this.eventListeners[eventName] = this.eventListeners[eventName] || [];
			this.eventListeners[eventName].push(callback);

			return;
		}

		if (this.isAdsManagerLoaded) {
			this.adsManager.addEventListener(eventName, callback);
		} else {
			this.adsLoader.addEventListener('adsManagerLoaded', () => {
				this.adsManager.addEventListener(eventName, callback);
			});
		}
	}

	setVastAttributes(status) {
		const currentAd =
			this.adsManager && this.adsManager.getCurrentAd && this.adsManager.getCurrentAd();
		const playerElement = this.params.container.querySelector('.video-player');

		vastDebugger.setVastAttributes(playerElement, this.vastUrl, status, currentAd);
	}

	setAutoPlay(value) {
		if (this.videoAd) {
			this.videoAd.autoplay = value;
			this.videoAd.muted = value;
		}
		this.params.autoPlay = value;
	}

	playVideo(width, height) {
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
			this.adsLoader.removeEventListener('adsManagerLoaded', callback);
		};

		if (this.isAdsManagerLoaded) {
			callback();
		} else {
			// When adsManager is not loaded yet video can't start without click on mobile
			// Muted auto play is workaround to run video on adsManagerLoaded event
			this.setAutoPlay(true);
			this.adsLoader.addEventListener('adsManagerLoaded', callback, false);
		}
	}

	reload() {
		const adRequest = googleImaSetup.createRequest(this.params);

		this.adsManager.destroy();
		this.adsLoader.contentComplete();
		this.setVastUrl(adRequest.adTagUrl);
		this.adsLoader.requestAds(adRequest);
	}

	resize(width, height, isFullscreen = false) {
		const viewMode = window.google.ima.ViewMode;

		if (this.adsManager) {
			this.adsManager.resize(
				Math.round(width),
				Math.round(height),
				isFullscreen ? viewMode.FULLSCREEN : viewMode.NORMAL,
			);
		}
	}

	dispatchEvent(eventName) {
		if (this.eventListeners[eventName] && this.eventListeners[eventName].length > 0) {
			this.eventListeners[eventName].forEach((callback) => {
				callback({});
			});
		}
	}

	setStatus(newStatus) {
		return () => {
			this.status = newStatus;
		};
	}

	getStatus() {
		return this.status;
	}

	getAdsManager() {
		return this.adsManager;
	}
}

export const googleImaPlayerFactory = {
	create(adDisplayContainer, adsLoader, videoSettings) {
		const adRequest = googleImaSetup.createRequest(videoSettings.getParams());
		const player = new GoogleImaPlayer(adDisplayContainer, adsLoader, videoSettings.getParams());
		const videoElement = getVideoElement();

		if (player.videoAd) {
			player.videoAd.classList.add('porvata-video');
			videoSettings.getContainer().classList.add('porvata');
		}

		adsLoader.addEventListener(
			'adsManagerLoaded',
			(adsManagerLoadedEvent) => {
				const renderingSettings = googleImaSetup.getRenderingSettings(videoSettings);
				const adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, renderingSettings);

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

				adsManager.addEventListener('loaded', () => player.setVastAttributes('success'));
				adsManager.addEventListener('adError', () => player.setVastAttributes('error'));
			},
			false,
		);

		adsLoader.addEventListener('adError', (event) => {
			const emptyVastErrorCode = window.google.ima.AdError.ErrorCode.VAST_EMPTY_RESPONSE;

			if (
				typeof event.getError === 'function' &&
				event.getError().getErrorCode() === emptyVastErrorCode
			) {
				player.dispatchEvent('wikiaEmptyAd');
			}

			player.setVastAttributes('error');
		});

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
