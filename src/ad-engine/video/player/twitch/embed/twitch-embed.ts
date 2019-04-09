import { scriptLoader } from '../../../../utils';
import { TwitchOptions } from '../twitch';

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

function getPlayer(identifier: string, videoSettings: TwitchOptions): any {
	return new window.Twitch.Player(identifier, videoSettings);
}

export const twitchEmbed = {
	load,
	getLibrary,
	getPlayer,
};
