import { AdSlot, slotService, utils } from '@ad-engine/core';
import { VideoSettings } from '../video-settings';
import { GoogleImaPlayer } from './google-ima-player';
import { googleImaPlayerFactory } from './google-ima-player-factory';

export class GoogleIma {
	private static instance: Promise<GoogleIma>;

	static async init(): Promise<GoogleIma> {
		if (!GoogleIma.instance) {
			GoogleIma.instance = new Promise(async (resolve) => {
				if (!(window.google && window.google.ima)) {
					await utils.scriptLoader.loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js');
				}

				resolve(new GoogleIma());
			});
		}

		return GoogleIma.instance;
	}

	getPlayer(videoSettings: VideoSettings): GoogleImaPlayer {
		const adDisplayContainer = new window.google.ima.AdDisplayContainer(
			videoSettings.getContainer(),
		);
		const iframe = videoSettings.getContainer().querySelector<HTMLIFrameElement>('div > iframe');
		const slotName = videoSettings.get('slotName');
		const slot = slotService.get(slotName);

		// Reload iframe in order to make IMA work when user is moving back/forward to the page with
		// player
		// https://groups.google.com/forum/#!topic/ima-sdk/Q6Y56CcXkpk
		// https://github.com/googleads/videojs-ima/issues/110
		if (
			window.performance &&
			window.performance.navigation &&
			window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD
		) {
			iframe.contentWindow.location.href = iframe.src;
		}

		const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

		if (slot) {
			slot.on(AdSlot.DESTROYED_EVENT, () => {
				adDisplayContainer.destroy();
			});
		}

		adsLoader.getSettings().setVpaidMode(videoSettings.getVpaidMode());

		return googleImaPlayerFactory.create(adDisplayContainer, adsLoader, videoSettings);
	}
}
