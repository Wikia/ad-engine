import {
	AdSlot,
	BaseServiceSetup,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	slotService,
	utils,
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
	constructor(protected optimizely: Optimizely) {
		super();
	}

	call() {
		this.setupOptimizelyExperiment();

		const showAds = !context.get('options.wad.blocking');
		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (showAds && !strategyRulesEnabled) {
			utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');
			new JWPlayerManager().manage();
			communicationService.dispatch(jwpSetup({ showAds, autoplayDisabled: false }));
		} else if (strategyRulesEnabled) {
			utils.logger(
				logGroup,
				'JWP Strategy Rules enabled - AdEngine does not control ads in JWP anymore',
			);

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
			new JWPlayerManager().manage();
			communicationService.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
		}
	}

	private generateVastUrlForJWPlayer() {
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
		if (variant) {
			this.optimizely.addVariantToTargeting(OPTIMIZELY_STRATEGY_RULES_EXPERIMENT, variant);
		}
		if (variant && variant === OPTIMIZELY_STRATEGY_RULES_EXPERIMENT_VARIANTS.ENABLED) {
			context.set('options.video.enableStrategyRules', true);
		}
	}
}
