import { context, utils } from '@ad-engine/core';
import { ConnatixPlayer } from './connatix-player';
import { PlayerInjector, PlayerInjectorInterface } from './player-injector';
import { ScriptLoaderInterface } from '../../ad-engine/utils';

export const logGroup = 'connatix';

export class Connatix {
	get cid(): string {
		return context.get('services.connatix.cid');
	}

	isEnabled(): boolean {
		return context.get('services.connatix.enabled');
	}

	constructor(
		private scriptLoader: ScriptLoaderInterface,
		private playerInjector: PlayerInjectorInterface,
	) {}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Connatix player is disabled');

			return Promise.resolve();
		}

		await this.loadPlayerAsset();
		this.playerInjector.insertPlayerContainer(this.cid);
	}

	private async loadPlayerAsset(): Promise<void> {
		const libraryUrl = `//cd.connatix.com/connatix.player.js?cid=${this.cid}`;

		utils.logger(logGroup, 'loading Connatix asset', libraryUrl);

		return this.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'Connatix player is ready');
		});
	}
}

const cnxPlayer = new ConnatixPlayer();

const playerInjector = new PlayerInjector(cnxPlayer);

export const connatix = new Connatix(utils.scriptLoader, playerInjector);
