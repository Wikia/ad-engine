import {
	BaseServiceSetup,
	context,
	InstantConfigService,
	Optimizely,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

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
export class JwpStrategyRulesSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: utils.GlobalTimeout,
		protected optimizely: Optimizely,
	) {
		super(instantConfig, globalTimeout);
	}

	call() {
		this.setupOptimizelyExperiment();
		this.addMediaIdToContextWhenStrategyRulesEnabled();
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

	private addMediaIdToContextWhenStrategyRulesEnabled() {
		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (!strategyRulesEnabled) {
			return;
		}

		context.set(
			'options.video.jwplayer.initialMediaId',
			window?.mw?.config?.get('wgArticleFeaturedVideo')?.mediaId,
		);
	}
}
