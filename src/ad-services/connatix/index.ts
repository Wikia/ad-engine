import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { context, isNoInContentVideoVariationActive } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import { ConnatixBidsRefresher } from './connatix-bids-refresher';
import { ConnatixPlayer, ConnatixPlayerApi } from './connatix-player';
import { ConnatixTracker } from './connatix-tracker';
import { initConnatixHeadScript } from './head-script';
import { PlayerInjector, PlayerInjectorInterface } from './player-injector';

export const logGroup = 'connatix';

export class Connatix extends BaseServiceSetup {
	get playerInstance(): undefined | ConnatixPlayerApi {
		return context.get('services.connatix.playerInstance');
	}

	get cid(): string {
		return context.get('services.connatix.cid');
	}

	isEnabled(): boolean {
		return !!context.get('services.connatix.enabled') && !!this.cid;
	}

	enableFloating() {
		logger(logGroup, 'enabling Connatix floating feature');
		this.playerInstance?.enableFloatingMode();
	}

	disableFloating() {
		logger(logGroup, 'disabling Connatix floating feature');
		this.playerInstance?.disableFloatingMode();
	}

	constructor(
		protected instantConfig,
		protected globalTimeout,
		private playerInjector: PlayerInjectorInterface,
		private tracker: ConnatixTracker,
	) {
		super();

		const connatixPlayer = new ConnatixPlayer();
		this.playerInjector = playerInjector ? playerInjector : new PlayerInjector(connatixPlayer);
		this.tracker = tracker ? tracker : new ConnatixTracker();
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			logger(logGroup, 'Connatix player is disabled');
			return;
		}

		if (isNoInContentVideoVariationActive()) {
			return;
		}

		logger(logGroup, 'initialized', this.cid);

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			this.loadOnUapStatus.bind(this),
		);
	}

	private loadOnUapStatus({ isLoaded, adProduct }: UapLoadStatus) {
		if (!isLoaded && adProduct !== 'ruap') {
			const isConnatixLazyLoaded = context.get('services.connatix.latePageInject');
			logger(logGroup, 'No Fan Takeover loaded - injecting Connatix player');

			if (!isConnatixLazyLoaded) {
				logger(logGroup, 'No need to wait for CONNATIX_LATE_INJECT');
				this.loadInitScript();
				this.playerInjector.insertPlayerContainer(this.cid, this.renderCallback.bind(this));
				return;
			}

			communicationService.on(eventsRepository.CONNATIX_LATE_INJECT, () => {
				logger(logGroup, 'CONNATIX_LATE_INJECT emitted');
				this.loadInitScript();
				this.playerInjector.insertPlayerContainer(this.cid, this.renderCallback.bind(this));
			});
		} else {
			logger(logGroup, 'Connatix blocked because of Fan Takeover');
		}
	}

	private loadInitScript() {
		initConnatixHeadScript(this.cid);
		this.tracker.trackInit();
		logger(logGroup, 'Connatix head script is ready');
	}

	private renderCallback(error, playerApi: ConnatixPlayerApi) {
		if (error) {
			logger(logGroup, 'Connatix encountered an error while loading', error);
			return;
		}

		context.set('services.connatix.playerInstance', playerApi);
		logger(logGroup, 'ready');
		communicationService.emit(eventsRepository.CONNATIX_READY);

		this.tracker.setPlayerApi(playerApi);
		this.tracker.trackReady();
		this.tracker.register();

		const bidsRefresher = new ConnatixBidsRefresher(playerApi);
		bidsRefresher.registerBidRefreshing();
	}
}
