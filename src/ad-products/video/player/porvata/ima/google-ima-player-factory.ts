import { context } from '@ad-engine/core';
import { IasTrackingParams, iasVideoTracker } from '../ias/ias-video-tracker';
import { moatVideoTracker } from '../moat/moat-video-tracker';
import { VideoSettings } from '../video-settings';
import { GoogleImaPlayer } from './google-ima-player';
import { googleImaSetup } from './google-ima-setup';

class GoogleImaPlayerFactory {
	create(
		adDisplayContainer: google.ima.AdDisplayContainer,
		adsLoader: google.ima.AdsLoader,
		videoSettings: VideoSettings,
	): GoogleImaPlayer {
		const adRequest = googleImaSetup.createRequest(videoSettings.getParams());
		const player = new GoogleImaPlayer(adDisplayContainer, adsLoader, videoSettings.getParams());
		const videoElement: HTMLVideoElement = this.getVideoElement();

		if (player.videoAd) {
			const container: HTMLElement | undefined = videoSettings.getContainer();

			player.videoAd.classList.add('porvata-video');
			if (!!container) {
				container.classList.add('porvata');
			}
		}

		if (videoSettings.isIasTrackingEnabled()) {
			iasVideoTracker.loadScript();
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

				if (videoSettings.isIasTrackingEnabled()) {
					const iasConfig: IasTrackingParams = context.get('options.video.iasTracking.config');

					iasVideoTracker.init(google, adsManager, videoSettings.getContainer(), iasConfig);
				}

				player.dispatchEvent('wikiaAdsManagerLoaded');

				adsManager.addEventListener(
					window.google.ima.AdEvent.Type.LOADED,
					(event: google.ima.AdEvent) => player.setVastAttributes('success', event.getAd()),
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
	}

	private getVideoElement(): HTMLVideoElement {
		const videoElement: HTMLVideoElement = document.createElement('video');

		videoElement.setAttribute('preload', 'none');

		return videoElement;
	}
}

export const googleImaPlayerFactory = new GoogleImaPlayerFactory();
