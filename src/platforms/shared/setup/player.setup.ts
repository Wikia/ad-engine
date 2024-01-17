import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	BaseServiceSetup,
	communicationService,
	context,
	displayAndVideoAdsSyncContext,
	eventsRepository,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	slotService,
	utils,
	VastResponseData,
	VastTaglessRequest,
	videoDisplayTakeoverSynchronizer,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'player-setup';

const OPTIMIZELY_STRATEGY_RULES_EXPERIMENT = {
	EXPERIMENT_ENABLED: 'strategy_rules',
	EXPERIMENT_VARIANT: 'strategy_rules_variant',
};

const OPTIMIZELY_STRATEGY_RULES_EXPERIMENT_VARIANTS = {
	DISABLED: 'strategy_rules_disabled',
	ENABLED: 'strategy_rules_enabled',
	UNDEFINED: 'strategy_rules_undefined',
};

@Injectable()
export class PlayerSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: utils.GlobalTimeout,
		protected optimizely: Optimizely,
		protected jwpManager: JWPlayerManager,
		protected vastTaglessRequest: VastTaglessRequest,
	) {
		super(instantConfig, globalTimeout);
		this.jwpManager = jwpManager ? jwpManager : new JWPlayerManager();
	}

	async call() {
		this.setupOptimizelyExperiment();

		const showAds = !context.get('options.wad.blocking');
		const vastResponse: VastResponseData =
			showAds &&
			displayAndVideoAdsSyncContext.isSyncEnabled() &&
			displayAndVideoAdsSyncContext.isTaglessRequestEnabled()
				? await this.vastTaglessRequest.getVast()
				: undefined;
		const connatixInstreamEnabled = !!this.instantConfig.get('icConnatixInstream');

		connatixInstreamEnabled
			? PlayerSetup.initConnatixPlayer(showAds, vastResponse)
			: this.initJWPlayer(showAds, vastResponse);
	}

	private async initJWPlayer(showAds, vastResponse) {
		utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

    if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			utils.logger(logGroup, 'display and video sync response available');
		}

		this.jwpManager.manage();

		if (showAds && !strategyRulesEnabled) {
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml: vastResponse?.xml,
				}),
			);
		} else if (strategyRulesEnabled) {
			utils.logger(
				logGroup,
				'JWP Strategy Rules enabled - AdEngine does not control ads in JWP anymore',
			);
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastUrl: await this.vastTaglessRequest.buildTaglessVideoRequest(),
					strategyRulesEnabled,
				}),
			);
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
				}),
			);
		}
	}

	private static initConnatixPlayer(showAds, vastResponse) {
		utils.logger(logGroup, 'Connatix with ads not controlled by AdEngine enabled');

		const videoAdSlotName = 'featured';
		const adSlot = slotService.get(videoAdSlotName) || new AdSlot({ id: videoAdSlotName });

		if (!slotService.get(videoAdSlotName)) {
			slotService.add(adSlot);
		}

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			utils.logger(logGroup, 'display and video sync response available');
		}

		communicationService.on(eventsRepository.VIDEO_EVENT, (payload) => {
			const { name, state } = payload.videoEvent;

			if (name === 'adImpression') {
				videoDisplayTakeoverSynchronizer.resolve(
					state.vastParams.lineItemId,
					state.vastParams.creativeId,
				);
				adSlot.setStatus(AdSlotStatus.STATUS_SUCCESS);
				adSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION);
			} else if (['adError', 'play', 'playError'].includes(name)) {
				videoDisplayTakeoverSynchronizer.resolve();
			}
		});

		communicationService.on(eventsRepository.BIDDERS_BIDDING_DONE, ({ slotName }) => {
			if (slotName === videoAdSlotName) {
				PlayerSetup.emitVideoSetupEvent(showAds, adSlot, vastResponse);
			}
		});
	}

	private static emitVideoSetupEvent(showAds, adSlot, vastResponse) {
		communicationService.emit(eventsRepository.VIDEO_SETUP, {
			showAds,
			autoplayDisabled: false,
			videoAdUnitPath: adSlot.getVideoAdUnit(),
			targetingParams: utils.getCustomParameters(adSlot, {}, false),
			vastXml: vastResponse?.xml,
		});
	}

	private setupOptimizelyExperiment() {
		this.optimizely.addVariantToTargeting(
			OPTIMIZELY_STRATEGY_RULES_EXPERIMENT,
			OPTIMIZELY_STRATEGY_RULES_EXPERIMENT_VARIANTS.UNDEFINED,
		);

		const variant = this.optimizely.getVariant(OPTIMIZELY_STRATEGY_RULES_EXPERIMENT);

		if (!variant) {
			return;
		}

		this.optimizely.addVariantToTargeting(OPTIMIZELY_STRATEGY_RULES_EXPERIMENT, variant);
		context.set(
			'options.video.enableStrategyRules',
			variant === OPTIMIZELY_STRATEGY_RULES_EXPERIMENT_VARIANTS.ENABLED,
		);
	}
}
