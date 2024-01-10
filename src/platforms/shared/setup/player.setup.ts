import {
	AdSlot,
	BaseServiceSetup,
	communicationService,
	context,
	displayAndVideoAdsSyncContext,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	slotService,
	utils,
	VastResponseData,
	VastTaglessRequest,
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
		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (showAds && !strategyRulesEnabled) {
			utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

			const vastResponse: VastResponseData =
				displayAndVideoAdsSyncContext.isSyncEnabled() &&
				displayAndVideoAdsSyncContext.isTaglessRequestEnabled()
					? await this.vastTaglessRequest.getVast()
					: undefined;

			if (vastResponse?.xml) {
				displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			}

			this.jwpManager.manage();
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
					vastUrl: this.generateVastUrlForJWPlayer(),
					strategyRulesEnabled,
				}),
			);
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
				}),
			);
		}
	}

	private generateVastUrlForJWPlayer(): string {
		const aspectRatio = 16 / 9;
		const slotName = 'featured';
		const position = 'preroll';

		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });
		if (!slotService.get(slotName)) {
			slotService.add(adSlot);
		}

		return utils.buildVastUrl(aspectRatio, adSlot.getSlotName(), { vpos: position });
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
