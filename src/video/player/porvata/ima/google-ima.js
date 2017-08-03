import GoogleImaPlayerFactory from './google-ima-player-factory';
import ScriptLoader from '../../../../utils/script-loader';

// const imaLibraryUrl = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
// const imaLibraryUrl = 'http://community.wikia.com/__am/1490274398/groups/-/ima_js';
const imaLibraryUrl = 'https://community.wikia.com/extensions/wikia/AdEngine/js/video/player/porvata/ima/20170219061519.js';

function load() {
	if (window.google && window.google.ima) {
		return new Promise((resolve) => {
			resolve();
		});
	}

	return ScriptLoader.loadScript(imaLibraryUrl);
}

function getPlayer(params) {
	const adDisplayContainer = new window.google.ima.AdDisplayContainer(params.container),
		iframe = params.container.querySelector('div > iframe');

	// Reload iframe in order to make IMA work when user is moving back/forward to the page with player
	// https://groups.google.com/forum/#!topic/ima-sdk/Q6Y56CcXkpk
	// https://github.com/googleads/videojs-ima/issues/110
	if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
		iframe.contentWindow.location.href = iframe.src;
	}

	const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

	return GoogleImaPlayerFactory.create(adDisplayContainer, adsLoader, params);
}

export default {
	load,
	getPlayer
};
