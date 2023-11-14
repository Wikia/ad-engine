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
		return !!context.get('services.connatix.enabled') && !!this.cid;
	}

	constructor(
		protected instantConfig,
		protected globalTimeout,
		private playerInjector: PlayerInjectorInterface,
	) {
		super();

		const connatixPlayer = new ConnatixPlayer();
		this.playerInjector = playerInjector ? playerInjector : new PlayerInjector(connatixPlayer);
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Connatix player is disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'initialized', this.cid);

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			this.loadOnUapStatus.bind(this),
		);
	}

	private loadOnUapStatus({ isLoaded, adProduct }: UapLoadStatus) {
		if (!isLoaded && adProduct !== 'ruap') {
			const isConnatixLazyLoaded = context.get('services.connatix.latePageInject');
			utils.logger(logGroup, 'No Fan Takeover loaded - injecting Connatix player');

			if (!isConnatixLazyLoaded) {
				utils.logger(logGroup, 'No need to wait for CONNATIX_LATE_INJECT');
				initConnatixHeadScript(this.cid);
				utils.logger(logGroup, 'Connatix head script is ready');
				this.playerInjector.insertPlayerContainer(this.cid);
				return;
			}

			communicationService.on(eventsRepository.CONNATIX_LATE_INJECT, () => {
				utils.logger(logGroup, 'CONNATIX_LATE_INJECT emitted');
				initConnatixHeadScript(this.cid);
				utils.logger(logGroup, 'Connatix head script is ready');
				this.playerInjector.insertPlayerContainer(this.cid);
			});
		} else {
			utils.logger(logGroup, 'Connatix blocked because of Fan Takeover');
		}
	}
}
