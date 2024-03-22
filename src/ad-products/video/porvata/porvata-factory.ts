// @ts-strict-ignore
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, AdSlotStatus, slotService, utils } from '@ad-engine/core';
import { GoogleImaWrapper } from './google-ima-wrapper';
import { iasVideoTracker } from './plugins/ias/ias-video-tracker';
import { PorvataPlugin } from './plugins/porvata-plugin';
import { PorvataPlayer } from './porvata-player';
import { PorvataSettings } from './porvata-settings';

function createVideoElement(): HTMLVideoElement {
	const videoElement: HTMLVideoElement = document.createElement('video');

	videoElement.setAttribute('preload', 'none');

	return videoElement;
}

function setSlotProperties(slot: AdSlot, videoSettings: PorvataSettings): void {
	slot.setConfigProperty('autoplay', videoSettings.isAutoPlay());
	slot.setConfigProperty('audio', !videoSettings.isAutoPlay());
	slot.setTargetingConfigProperty('autoplay', videoSettings.isAutoPlay() ? 'yes' : 'no');
	slot.setTargetingConfigProperty('audio', !videoSettings.isAutoPlay() ? 'yes' : 'no');
}

function getPlugins(settings: PorvataSettings): PorvataPlugin[] {
	const imaPlugins: PorvataPlugin[] = [iasVideoTracker];

	return imaPlugins.filter((plugin) => plugin.isEnabled(settings));
}

export class PorvataFactory {
	private static loadSdkPromise: Promise<Event | void>;

	static async create(settings: PorvataSettings): Promise<PorvataPlayer> {
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'porvata_start',
		});
		settings.getPlayerContainer().style.opacity = '0';

		await PorvataFactory.load();

		const slotName = settings.getSlotName();
		const slot = slotService.get(slotName);
		setSlotProperties(slot, settings);

		const adDisplayContainer = GoogleImaWrapper.createDisplayContainer(
			settings.getPlayerContainer(),
			slot,
		);
		const adsLoader = GoogleImaWrapper.createAdsLoader(adDisplayContainer, settings);
		const adsRequest = GoogleImaWrapper.createAdsRequest(settings);
		const plugins = getPlugins(settings);

		const player = new PorvataPlayer(adDisplayContainer, adsLoader, adsRequest, settings);

		plugins.forEach((plugin) => plugin.load());

		this.registerAdsLoaderListeners(adsLoader, player, settings, plugins);

		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'porvata_ready',
		});

		await player.requestAds();

		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'porvata_done',
		});

		return player;
	}

	private static async load(): Promise<Event | void> {
		if (!PorvataFactory.loadSdkPromise) {
			PorvataFactory.loadSdkPromise = !(window.google && window.google.ima)
				? utils.scriptLoader.loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js')
				: new Promise<void>((resolve) => resolve());
		}

		return PorvataFactory.loadSdkPromise;
	}

	private static registerAdsLoaderListeners(
		adsLoader: google.ima.AdsLoader,
		player: PorvataPlayer,
		settings: PorvataSettings,
		plugins: PorvataPlugin[],
	): void {
		adsLoader.addEventListener(
			window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
			(adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) => {
				const renderingSettings = GoogleImaWrapper.getRenderingSettings();
				const adsManager: google.ima.AdsManager = adsManagerLoadedEvent.getAdsManager(
					createVideoElement(),
					renderingSettings,
				);

				player.setAdsManager(adsManager);
				Promise.all(plugins.map((plugin) => plugin.init(player, settings))).then(() => {
					player.dispatchEvent('wikiaAdsManagerLoaded');
					settings.getPlayerContainer().style.opacity = '1';
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

				player.setAdStatus(AdSlotStatus.STATUS_ERROR);
			},
		);
	}
}
