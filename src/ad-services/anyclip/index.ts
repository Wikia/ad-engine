import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	AdSlotClass,
	context,
	incontentVideoRemovalExperimentName,
	incontentVideoRemovalVariationName,
	isIncontentPlayerRemovalVariationActive,
	slotDataParamsUpdater,
	slotService,
	targetingService,
} from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader, WaitFor } from '@ad-engine/utils';
import { DataWarehouseTracker } from '../../platforms/shared';
import { AnyclipBidsRefresher } from './anyclip-bids-refresher';
import { AnyclipTracker } from './anyclip-tracker';

const logGroup = 'Anyclip';
const DEFAULT_WIDGET_NAME = '001w000001Y8ud2_19593';
const SUBSCRIBE_FUNC_NAME = 'lreSubscribe';
const isSubscribeReady = () => typeof window[SUBSCRIBE_FUNC_NAME] !== 'undefined';
const isPlayerAdSlotReady = (slotName = 'incontent_player') => {
	const adSlot = slotService.get(slotName);
	const domReady = !!document.getElementById(slotName);

	logger(logGroup, `Waiting for player ad slot (${slotName}) ready`, domReady, adSlot);

	return domReady && adSlot !== null;
};

export class Anyclip extends BaseServiceSetup {
	private get pubname(): string {
		return context.get('services.anyclip.pubname') || 'fandomcom';
	}

	private get widgetname(): string {
		const widgetNameParam = context.get('services.anyclip.widgetname');

		if (['string', 'undefined'].includes(typeof widgetNameParam)) {
			return widgetNameParam || DEFAULT_WIDGET_NAME;
		}

		if (typeof widgetNameParam === 'object') {
			const wikiVertical = targetingService.get('s0v');
			return widgetNameParam[wikiVertical] || widgetNameParam['default'] || DEFAULT_WIDGET_NAME;
		}

		return DEFAULT_WIDGET_NAME;
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
	private bidRefresher: AnyclipBidsRefresher;
	private dwTracker: DataWarehouseTracker;

	call() {
		if (!this.isEnabled('services.anyclip.enabled', false)) {
			logger(logGroup, 'disabled');
			return;
		}

		this.dwTracker = new DataWarehouseTracker();

		if (Anyclip.isApplicable()) {
			this.dwTracker.track({
				value: 'anyclip-in-content',
				action: 'impression',
				label: incontentVideoRemovalVariationName,
				category: incontentVideoRemovalExperimentName,
			});
		}

		if (Anyclip.isApplicable() && isIncontentPlayerRemovalVariationActive()) {
			this.dwTracker.track({
				value: 'anyclip-in-content',
				action: 'player-removed',
				label: incontentVideoRemovalVariationName,
				category: incontentVideoRemovalExperimentName,
			});
			return;
		}

		logger(logGroup, 'initialized', this.pubname, this.widgetname, this.libraryUrl);
		communicationService.emit(eventsRepository.ANYCLIP_START);

		this.tracker = new AnyclipTracker(SUBSCRIBE_FUNC_NAME);
		this.bidRefresher = new AnyclipBidsRefresher(SUBSCRIBE_FUNC_NAME);

		if (context.get('services.anyclip.loadWithoutAnchor')) {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					if (!action.isLoaded) {
						this.loadPlayerAsset();
					}
				},
			);

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
		logger(logGroup, 'Destroying Anyclip widgets');
		window?.anyclip?.widgets?.forEach((w) => w?.destroy());
	}

	enableFloating() {
		logger(logGroup, 'enabling Anyclip floating feature ');
		window?.anyclip?.getWidget()?.floatingModeToggle(true);
	}

	disableFloating() {
		logger(logGroup, 'disabling Anyclip floating feature ');
		window?.anyclip?.getWidget()?.floatingModeToggle(false);
	}

	get params(): Record<string, string> {
		return {
			pubname: this.pubname,
			widgetname: this.widgetname,
		};
	}

	private loadPlayerAsset(playerContainer: HTMLElement = null) {
		if (!Anyclip.isApplicable()) {
			logger(logGroup, 'not applicable - aborting');
			return;
		}

		logger(logGroup, 'loading Anyclip asset', this.libraryUrl);

		return scriptLoader.loadScript(this.libraryUrl, true, playerContainer, this.params).then(() => {
			playerContainer?.classList.remove(AdSlotClass.HIDDEN_AD_CLASS);
			logger(logGroup, 'ready');

			this.waitForSubscribeReady().then((isSubscribeReady) => {
				communicationService.emit(eventsRepository.ANYCLIP_READY);
				logger(
					logGroup,
					'Anyclip global subscribe function set',
					isSubscribeReady,
					window[SUBSCRIBE_FUNC_NAME],
				);

				this.waitForPlayerAdSlot().then(() => {
					this.tracker.trackInit();
					this.bidRefresher.trySubscribingBidRefreshing();
				});

				isSubscribeReady
					? this.tracker.register()
					: logger(logGroup, 'Anyclip global subscribe function not set');
			});
		});
	}

	private loadOnUapStatus({ isLoaded, adProduct }: UapLoadStatus) {
		this.tracker.trackEligible();

		if (!isLoaded && adProduct !== 'ruap') {
			if (!context.get('services.anyclip.latePageInject')) {
				logger(logGroup, 'No need to wait for ANYCLIP_LATE_INJECT');
				this.initIncontentPlayer();
				return;
			}

			communicationService.on(eventsRepository.ANYCLIP_LATE_INJECT, () => {
				logger(logGroup, 'ANYCLIP_LATE_INJECT emitted');
				this.initIncontentPlayer();
			});
		} else {
			logger(logGroup, 'Anyclip blocked because of Fan Takeover');
		}
	}

	private initIncontentPlayer() {
		const slotName = 'incontent_player';
		const playerAdSlot = slotService.get(slotName);
		const playerElementId = context.get('services.anyclip.playerElementId');

		if (!playerAdSlot && !playerElementId) {
			logger(logGroup, 'No incontent player - aborting');
			return;
		}

		if (playerElementId) {
			this.waitForPlayerAdSlot(playerElementId).then(() => {
				if (!isPlayerAdSlotReady()) {
					logger(logGroup, 'No incontent player - aborting');
					return;
				}

				const playerElement = document.getElementById(playerElementId);
				this.loadPlayerAsset(playerElement);
				playerElement.dataset.slotLoaded = 'true';
			});
			return;
		}

		slotDataParamsUpdater.updateOnCreate(playerAdSlot);
		this.loadPlayerAsset(playerAdSlot.getElement());
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new WaitFor(isSubscribeReady, 4, 250).until();
	}

	private waitForPlayerAdSlot(playerAdSlotName = 'incontent_player'): Promise<boolean> {
		return new WaitFor(() => isPlayerAdSlotReady(playerAdSlotName), 4, 250).until();
	}
}
