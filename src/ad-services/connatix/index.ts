import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { ConnatixPlayer } from './connatix-player';
import { initConnatixHeadScript } from './head-script';
import { PlayerInjector, PlayerInjectorInterface } from './player-injector';

export const logGroup = 'connatix';

export class Connatix extends BaseServiceSetup {
	get cid(): string {
		return context.get('services.connatix.cid');
	}

	isEnabled(): boolean {
		return context.get('services.connatix.enabled');
	}

	constructor(
		protected instantConfig,
		protected globalTimeout,
		private playerInjector: PlayerInjectorInterface,
	) {
		super();

		const cnxPlayer = new ConnatixPlayer();
		this.playerInjector = playerInjector ? playerInjector : new PlayerInjector(cnxPlayer);
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Connatix player is disabled');
			return Promise.resolve();
		}

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (!action.isLoaded) {
				utils.logger(logGroup, 'No Fan Takeover loaded - injecting Connatix player');
				initConnatixHeadScript(this.cid);
				utils.logger(logGroup, 'Connatix head script is ready');
				this.playerInjector.insertPlayerContainer(this.cid);
			}
		});
	}
}
