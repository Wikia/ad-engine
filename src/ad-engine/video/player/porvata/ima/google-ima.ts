import { scriptLoader } from '../../../../utils';
import { googleImaPlayerFactory } from './google-ima-player-factory';

const imaLibraryUrl = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

function load() {
	if (window.google && window.google.ima) {
		return new Promise((resolve) => {
			resolve();
		});
	}

	return scriptLoader.loadScript(imaLibraryUrl);
}

function getPlayer(videoSettings) {
	const adDisplayContainer = new window.google.ima.AdDisplayContainer(videoSettings.getContainer());
	const iframe = videoSettings.getContainer().querySelector('div > iframe');

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

	adsLoader.getSettings().setVpaidMode(videoSettings.getVpaidMode());

	return googleImaPlayerFactory.create(adDisplayContainer, adsLoader, videoSettings);
}

export const googleIma = {
	load,
	getPlayer,
};
