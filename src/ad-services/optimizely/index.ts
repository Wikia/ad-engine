import { targetingService } from '@ad-engine/core';
import { logger, queryString } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';

type OptimizelyVariablesType = {
	EXPERIMENT_ENABLED: string;
	EXPERIMENT_VARIANT: string;
};

type TargetingValues = {
	[key: string]: any;
};

const logGroup = 'optimizely';

@Injectable()
export class Optimizely {
	private targetingValues: TargetingValues = {};

	getVariant(optimizelyVariables: OptimizelyVariablesType): string | undefined {
		const forcedValue = this.getForcedValue(optimizelyVariables.EXPERIMENT_VARIANT);

		if (forcedValue) {
			logger(logGroup, `Experiment ${optimizelyVariables.EXPERIMENT_ENABLED} - forced value`);
			return forcedValue;
		}

		if (!this.getOptimizelyValue(optimizelyVariables.EXPERIMENT_ENABLED)) {
			logger(logGroup, `Experiment ${optimizelyVariables.EXPERIMENT_ENABLED} is disabled`);
			return;
		}

		const variant = this.getOptimizelyValue(optimizelyVariables.EXPERIMENT_VARIANT);
		logger(logGroup, `Variant name: ${optimizelyVariables.EXPERIMENT_VARIANT}`);

		if (variant === undefined) {
			logger(logGroup, `Experiment ${optimizelyVariables.EXPERIMENT_VARIANT} has undefined value`);

			return;
		}

		logger(logGroup, `Experiment ${optimizelyVariables.EXPERIMENT_VARIANT} variant: ${variant}`);

		return variant.toString();
	}

	addVariantToTargeting(optimizelyVariables: OptimizelyVariablesType, value: string) {
		this.targetingValues[optimizelyVariables.EXPERIMENT_ENABLED] = value;

		targetingService.set('experiment_groups', Object.values(this.targetingValues));
	}

	private getOptimizelyValue(variableName: string): string | boolean | undefined {
		window.adsExperiments = window.adsExperiments || {};

		return window.adsExperiments[variableName] ?? undefined;
	}

	private getForcedValue(variantVariableName: string): string {
		return queryString.get(`optimizely_${variantVariableName}`);
	}
}
