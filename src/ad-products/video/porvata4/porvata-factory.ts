import { AdSlot, slotService, utils } from '@ad-engine/core';
import { GoogleImaWrapper } from './google-ima-wrapper';
import { iasVideoTracker } from './plugins/ias/ias-video-tracker';
import { moatVideoTracker } from './plugins/moat/moat-video-tracker';
import { PorvataPlugin } from './plugins/porvata-plugin';
import { PorvataPlayer } from './porvata-player';
import { VideoSettings } from './video-settings';

function createVideoElement(): HTMLVideoElement {
	const videoElement: HTMLVideoElement = document.createElement('video');

	videoElement.setAttribute('preload', 'none');

	return videoElement;
}

function setSlotProperties(slot: AdSlot, videoSettings: VideoSettings): void {
	slot.setConfigProperty('autoplay', videoSettings.isAutoPlay());
	slot.setConfigProperty('audio', !videoSettings.isAutoPlay());
	slot.setConfigProperty('targeting.autoplay', videoSettings.isAutoPlay() ? 'yes' : 'no');
	slot.setConfigProperty('targeting.audio', !videoSettings.isAutoPlay() ? 'yes' : 'no');
}

function getPlugins(settings: VideoSettings): PorvataPlugin[] {
	const imaPlugins: PorvataPlugin[] = [iasVideoTracker, moatVideoTracker];

	return imaPlugins.filter((plugin) => plugin.isEnabled(settings));
}

export class PorvataFactory {
	private static loadSdkPromise: Promise<void>;

	static async create(videoSettings: VideoSettings): Promise<PorvataPlayer> {
		videoSettings.getContainer().style.opacity = '0';

		await PorvataFactory.load();

		const slotName = videoSettings.get('slotName');
		const slot = slotService.get(slotName);
		setSlotProperties(slot, videoSettings);

		const adDisplayContainer = GoogleImaWrapper.createDisplayContainer(
			videoSettings.getContainer(),
			slot,
		);
		const adsLoader = GoogleImaWrapper.createAdsLoader(adDisplayContainer, videoSettings);
		const adsRequest = GoogleImaWrapper.createAdsRequest(videoSettings);

		const player = new PorvataPlayer(adDisplayContainer, adsLoader, adsRequest, videoSettings);
		const plugins = getPlugins(videoSettings);

		plugins.forEach((plugin) => plugin.load());

		this.registerAdsLoaderListeners(adsLoader, player, videoSettings, plugins);

		await player.requestAds();

		return player;
	}

	private static async load(): Promise<void> {
		if (!PorvataFactory.loadSdkPromise) {
			PorvataFactory.loadSdkPromise = new Promise(async (resolve) => {
				if (!(window.google && window.google.ima)) {
					await utils.scriptLoader.loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js');
				}

				resolve();
			});
		}

		return PorvataFactory.loadSdkPromise;
	}

	private static registerAdsLoaderListeners(
		adsLoader: google.ima.AdsLoader,
		player: PorvataPlayer,
		videoSettings: VideoSettings,
		plugins: PorvataPlugin[],
	): void {
		adsLoader.addEventListener(
			window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
			(adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) => {
				const renderingSettings = GoogleImaWrapper.getRenderingSettings(videoSettings);
				const adsManager: google.ima.AdsManager = adsManagerLoadedEvent.getAdsManager(
					createVideoElement(),
					renderingSettings,
				);

				player.setAdsManager(adsManager);

				Promise.all(plugins.map((plugin) => plugin.init(adsManager, videoSettings))).then(() => {
					player.dispatchEvent('wikiaAdsManagerLoaded');
					videoSettings.getContainer().style.opacity = '1';
				});
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
	}
}
