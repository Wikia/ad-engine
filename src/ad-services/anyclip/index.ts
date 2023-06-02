import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	BaseServiceSetup,
	context,
	slotDataParamsUpdater,
	slotService,
	utils,
} from '@ad-engine/core';
import { AnyclipTracker } from './anyclip-tracker';

const logGroup = 'Anyclip';
const SUBSCRIBE_FUNC_NAME = 'lreSubscribe';
const isSubscribeReady = () => typeof window[SUBSCRIBE_FUNC_NAME] !== 'undefined';
const incontentSlotExists = () => {
	const slotName = 'incontent_player';
	const adSlot = slotService.get(slotName);
	const domReady = !!document.getElementById(slotName);

	utils.logger(logGroup, 'Waiting for incontent_player ready', domReady, adSlot);

	return domReady && adSlot !== null;
};

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

	static isApplicable(): boolean {
		const isApplicableFunc: () => boolean | null = context.get('services.anyclip.isApplicable');

		return typeof isApplicableFunc === 'function' ? isApplicableFunc() : true;
	}

	private tracker: AnyclipTracker;

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

	reset() {
		utils.logger(logGroup, 'Destroying Anyclip widgets');
		window?.anyclip?.widgets?.forEach((w) => w?.destroy());
	}

	get params(): Record<string, string> {
		return {
			pubname: this.pubname,
			widgetname: this.widgetname,
		};
	}

	private loadPlayerAsset(playerContainer: HTMLElement = null) {
		if (!Anyclip.isApplicable()) {
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

					this.waitForIncontentSlotReady().then(() => {
						this.tracker.trackInit();
					});

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
		const playerElementSelector = context.get('services.anyclip.playerElementSelector');

		if (!playerAdSlot && !playerElementSelector) {
			utils.logger(logGroup, 'No incontent player - aborting');
			return;
		}

		if (playerElementSelector) {
			this.waitForIncontentSlotReady().then(() => {
				this.loadPlayerAsset(document.querySelector(playerElementSelector));
			});
			return;
		}

		slotDataParamsUpdater.updateOnCreate(playerAdSlot);
		this.loadPlayerAsset(playerAdSlot.getElement());
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(isSubscribeReady, 4, 250).until();
	}

	private waitForIncontentSlotReady(): Promise<boolean> {
		return new utils.WaitFor(incontentSlotExists, 4, 250).until();
	}
}
