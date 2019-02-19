import { TwitchListener } from '../../../listeners/twitch-listener';
import { twitchEmbed } from './embed/twitch-embed';

export class TwitchPlayer {
	constructor(identifier, videoSettings, params) {
		this.identifier = identifier;
		this.videoSettings = videoSettings;
		this.params = params;
	}

	async getPlayer() {
		this.player = await Twitch.inject(this.identifier, this.videoSettings, this.params);

		return this.player;
	}

	addEventListener(eventName, callback) {
		this.player.addEventListener(eventName, callback);
	}

	getIdentifier() {
		return this.identifier;
	}

	getVideoSettings() {
		return this.videoSettings;
	}
}

export class Twitch {
	static inject(identifier, videoSettings, params) {
		const twitchListener = new TwitchListener(params);

		twitchListener.init();

		return twitchEmbed
			.load()
			.then(() => twitchEmbed.getPlayer(identifier, videoSettings))
			.then((player) => {
				twitchListener.registerTwitchEvents(player);

				return player;
			});
	}
}
