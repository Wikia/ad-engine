import { scriptLoader } from '../../../../utils';

const twitchLibraryUrl = '//player.twitch.tv/js/embed/v1.js';

function load(): Promise<Event | void> {
	if (window.Twitch) {
		return Promise.resolve();
	}

	return scriptLoader.loadScript(twitchLibraryUrl);
}

function getLibrary(): any {
	return window.Twitch;
}

function getPlayer(identifier, videoSettings): any {
	return new window.Twitch.Player(identifier, videoSettings);
}

export const twitchEmbed = {
	load,
	getLibrary,
	getPlayer,
};
