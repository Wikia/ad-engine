import { TwitchListener } from '../../../listeners/twitch-listener';
import { Dictionary } from '../../../models';
import { twitchEmbed } from './embed/twitch-embed';

export interface TwitchOptions {
	height: string;
	width: string;
	channel: string;
}

export class TwitchPlayer {
	private player: any;

	constructor(
		private readonly identifier: string,
		private readonly videoSettings: TwitchOptions,
		private readonly params: Dictionary,
	) {
		this.params = params;
	}

	async getPlayer(): Promise<any> {
		this.player = await Twitch.inject(this.identifier, this.videoSettings, this.params);

		return this.player;
	}

	addEventListener(eventName: string, callback: () => void): void {
		this.player.addEventListener(eventName, callback);
	}

	getIdentifier(): string {
		return this.identifier;
	}

	getVideoSettings(): TwitchOptions {
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
