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
	private get pubname(): string {
		return context.get('services.anyclip.pubname') || 'fandomcom';
	}
	private get widgetname(): string {
		return context.get('services.anyclip.widgetname') || '001w000001Y8ud2_19593';
	}
	private get libraryUrl(): string {
		return (
			context.get('services.anyclip.libraryUrl') ||
			'//player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js'
		);
	}
	private get isApplicable(): () => boolean | null {
		return context.get('services.anyclip.isApplicable');
	}
	private tracker: VideoTracker;

	call() {
		if (context.get('custom.hasFeaturedVideo') || !this.isEnabled('icAnyclipPlayer', false)) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'initialized', this.pubname, this.widgetname, this.libraryUrl);

		this.tracker = new AnyclipTracker(SUBSCRIBE_FUNC_NAME);

		if (context.get('services.anyclip.loadOnPageLoad')) {
			this.loadPlayerAsset();
			return;
		}

		if (context.get('custom.hasIncontentPlayer')) {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				this.loadOnUapStatus.bind(this),
			);
		}
	}

	get params(): Record<string, string> {
		return {
			pubname: this.pubname,
			widgetname: this.widgetname,
		};
	}

	private loadPlayerAsset(playerContainer: HTMLElement = null) {
		if (typeof this.isApplicable === 'function' && !this.isApplicable()) {
			utils.logger(logGroup, 'not applicable - aborting');
			return;
		}

		utils.logger(logGroup, 'loading Anyclip asset', this.libraryUrl);

		return utils.scriptLoader
			.loadScript(this.libraryUrl, 'text/javascript', true, playerContainer, this.params)
			.then(() => {
				playerContainer?.classList.remove('hide');
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

	private loadOnUapStatus({ isLoaded, adProduct }: UapLoadStatus) {
		if (!isLoaded && adProduct !== 'ruap') {
			if (!context.get('services.anyclip.latePageInject')) {
				this.initIncontentPlayer();
				return;
			}

			communicationService.on(eventsRepository.ANYCLIP_LATE_INJECT, () => {
				this.initIncontentPlayer();
			});
		}
	}

	private initIncontentPlayer() {
		const slotName = 'incontent_player';
		const playerAdSlot = slotService.get(slotName);

		if (!playerAdSlot) {
			utils.logger(logGroup, 'No incontent player - aborting');
			return;
		}

		slotDataParamsUpdater.updateOnCreate(playerAdSlot);
		this.loadPlayerAsset(playerAdSlot.getElement());
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(isSubscribeReady, 4, 250).until();
	}
}
