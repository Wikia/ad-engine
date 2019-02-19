import { scriptLoader } from '../../../../utils';

const twitchLibraryUrl = '//player.twitch.tv/js/embed/v1.js';

function load() {
	if (window.Twitch) {
		return Promise.resolve();
	}

	return scriptLoader.loadScript(twitchLibraryUrl);
}

function getLibrary() {
	return window.Twitch;
}

function getPlayer(identifier, videoSettings) {
	return new window.Twitch.Player(identifier, videoSettings);
}

export const twitchEmbed = {
	load,
	getLibrary,
	getPlayer,
};
