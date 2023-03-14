import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	BaseServiceSetup,
	context,
	slotDataParamsUpdater,
	slotService,
	utils,
	VideoTracker,
} from '@ad-engine/core';
import { AnyclipTracker } from './anyclip-tracker';

const logGroup = 'Anyclip';
const SUBSCRIBE_FUNC_NAME = 'lreSubscribe';
const isSubscribeReady = () => typeof window[SUBSCRIBE_FUNC_NAME] !== 'undefined';

export class Anyclip extends BaseServiceSetup {
	private pubname: string;
	private widgetname: string;
	private libraryUrl: string;
	private isApplicable: () => boolean | null;
	private tracker: VideoTracker;

	call() {
		if (context.get('custom.hasFeaturedVideo') || !this.isEnabled('icAnyclipPlayer', false)) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		this.setupConfig();

		if (context.get('services.anyclip.loadOnPageLoad')) {
			this.loadPlayerAsset();
			return;
		}

		this.loadOnUapReadyStatus();
	}

	get params(): Record<string, string> {
		return {
			pubname: this.pubname,
			widgetname: this.widgetname,
		};
	}

	private setupConfig() {
		this.pubname = context.get('services.anyclip.pubname') || 'fandomcom';
		this.widgetname = context.get('services.anyclip.widgetname') || '001w000001Y8ud2_19593';
		this.libraryUrl =
			context.get('services.anyclip.libraryUrl') ||
			'//player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js';
		this.isApplicable = context.get('services.anyclip.isApplicable');
		this.tracker = new AnyclipTracker(SUBSCRIBE_FUNC_NAME);

		utils.logger(logGroup, 'initialized', this.pubname, this.widgetname, this.libraryUrl);
	}

	private loadPlayerAsset() {
		if (typeof this.isApplicable === 'function' && !this.isApplicable()) {
			utils.logger(logGroup, 'not applicable - aborting');
			return;
		}

		utils.logger(logGroup, 'loading Anyclip asset', this.libraryUrl);
		const incontentPlayerContainer = document.getElementById('incontent_player');

		return utils.scriptLoader
			.loadScript(this.libraryUrl, 'text/javascript', true, incontentPlayerContainer, this.params)
			.then(() => {
				incontentPlayerContainer?.classList.remove('hide');
				utils.logger(logGroup, 'ready');

				this.waitForSubscribeReady().then((isSubscribeReady) => {
					utils.logger(
						logGroup,
						'Anyclip global subscribe function set',
						isSubscribeReady,
						window[SUBSCRIBE_FUNC_NAME],
					);

					isSubscribeReady
						? this.tracker.register()
						: utils.logger(logGroup, 'Anyclip global subscribe function not set');
				});
			});
	}

	private loadOnUapReadyStatus() {
		const slotName = 'incontent_player';

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			({ isLoaded, adProduct }: UapLoadStatus) => {
				if (!isLoaded && adProduct !== 'ruap') {
					if (!context.get('services.anyclip.latePageInject')) {
						this.initIncontentPlayer(slotService.get(slotName));
						return;
					}

					communicationService.on(eventsRepository.ANYCLIP_LATE_INJECT, () => {
						this.initIncontentPlayer(slotService.get(slotName));
					});
				}
			},
		);
	}

	private initIncontentPlayer(incontentPlayer) {
		if (!incontentPlayer) {
			utils.logger(logGroup, 'No incontent player - aborting');
			return;
		}

		slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		this.loadPlayerAsset();
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(isSubscribeReady, 4, 250).until();
	}
}
