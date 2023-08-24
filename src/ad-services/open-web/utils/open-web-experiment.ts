import { context } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { Optimizely } from '../../optimizely';

type optimizelyOpenWebExperiment = {
	EXPERIMENT_ENABLED: string;
	EXPERIMENT_VARIANT: string;
};

type optimizelyOpenWebExperimentVariants = {
	CONTROL_GROUP: string;
	AD_UNIT: string;
};

const OPTIMIZELY_DESKTOP_OPEN_WEB_EXPERIMENT: optimizelyOpenWebExperiment = {
	EXPERIMENT_ENABLED: 'desktop_open_web',
	EXPERIMENT_VARIANT: 'desktop_open_web_variant',
};

const OPTIMIZELY_DESKTOP_OPEN_WEB_EXPERIMENT_VARIANTS: optimizelyOpenWebExperimentVariants = {
	CONTROL_GROUP: 'desktop_open_web_control_group',
	AD_UNIT: 'desktop_open_web_ad_unit',
};

const OPTIMIZELY_MOBILE_OPEN_WEB_EXPERIMENT: optimizelyOpenWebExperiment = {
	EXPERIMENT_ENABLED: 'mobile_open_web',
	EXPERIMENT_VARIANT: 'mobile_open_web_variant',
};

const OPTIMIZELY_MOBILE_OPEN_WEB_EXPERIMENT_VARIANTS: optimizelyOpenWebExperimentVariants = {
	CONTROL_GROUP: 'mobile_open_web_control_group',
	AD_UNIT: 'mobile_open_web_replace_incontent',
};

@Injectable()
export class OpenWebExperiment {
	constructor(protected optimizely: Optimizely) {}

	public isEnabledExperiment(): boolean {
		const isMobile = context.get('state.isMobile');
		const experiment = isMobile
			? OPTIMIZELY_MOBILE_OPEN_WEB_EXPERIMENT
			: OPTIMIZELY_DESKTOP_OPEN_WEB_EXPERIMENT;
		const variants = isMobile
			? OPTIMIZELY_MOBILE_OPEN_WEB_EXPERIMENT_VARIANTS
			: OPTIMIZELY_DESKTOP_OPEN_WEB_EXPERIMENT_VARIANTS;

		const variant = this.optimizely.getVariant(experiment);
		if (variant) {
			this.optimizely.addVariantToTargeting(experiment, variant);
		}

		return variant === variants.AD_UNIT;
	}
}
