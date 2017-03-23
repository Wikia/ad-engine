import GoogleImaSetup from './google-ima-setup';
import MoatVideoTracker from '../moat/moat-video-tracker';

class GoogleImaPlayer {
	constructor(adDisplayContainer, adsLoader, params) {
		this.isAdsManagerLoaded = false;
		this.status = '';
		this.adDisplayContainer = adDisplayContainer;
		this.adsLoader = adsLoader;
		this.adsManager = null;
		this.params = params;
		this.mobileVideoAd = params.container.querySelector('video');
		this.eventListeners = {};
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

	setAutoPlay(value) {
		// mobileVideoAd DOM element is present on mobile only
		if (this.mobileVideoAd) {
			this.mobileVideoAd.autoplay = value;
			this.mobileVideoAd.muted = value;
		}
	}

	playVideo(width, height) {
		const callback = () => {
			// https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer.initialize
			this.adDisplayContainer.initialize();
			this.adsManager.init(Math.round(width), Math.round(height), window.google.ima.ViewMode.NORMAL);
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
		this.adsManager.destroy();
		this.adsLoader.contentComplete();
		this.adsLoader.requestAds(GoogleImaSetup.createRequest(this.params));
	}

	resize(width, height) {
		if (this.adsManager) {
			this.adsManager.resize(Math.round(width), Math.round(height), window.google.ima.ViewMode.NORMAL);
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

export default class GoogleImaFactory {
	static create(adDisplayContainer, adsLoader, params) {
		const player = new GoogleImaPlayer(adDisplayContainer, adsLoader, params),
			videoMock = document.createElement('video');

		adsLoader.addEventListener('adsManagerLoaded', (adsManagerLoadedEvent) => {
			const renderingSettings = GoogleImaSetup.getRenderingSettings(params),
				adsManager = adsManagerLoadedEvent.getAdsManager(videoMock, renderingSettings);
			player.setAdsManager(adsManager);

			if (params.moatTracking) {
				MoatVideoTracker.init(adsManager, params.container, window.google.ima.ViewMode.NORMAL);
			}
		}, false);
		adsLoader.requestAds(GoogleImaSetup.createRequest(params));
		if (params.autoPlay) {
			player.setAutoPlay(true);
		}

		player.addEventListener('resume', player.setStatus('playing'));
		player.addEventListener('start', player.setStatus('playing'));
		player.addEventListener('pause', player.setStatus('paused'));

		return player;
	}
}
