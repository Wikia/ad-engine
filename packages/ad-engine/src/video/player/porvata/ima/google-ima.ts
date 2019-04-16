import { AdSlot } from '../../../../models/index';
import { slotService } from '../../../../services/index';
import { scriptLoader } from '../../../../utils/index';
import { VideoSettings } from '../video-settings';
import { GoogleImaPlayer, googleImaPlayerFactory } from './google-ima-player-factory';

const imaLibraryUrl = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

function load(): Promise<Event> {
	if (window.google && window.google.ima) {
		return new Promise((resolve) => {
			resolve();
		});
	}

	return scriptLoader.loadScript(imaLibraryUrl);
}

function getPlayer(videoSettings: VideoSettings): GoogleImaPlayer {
	const adDisplayContainer = new window.google.ima.AdDisplayContainer(videoSettings.getContainer());
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

export const googleIma = {
	load,
	getPlayer,
};
