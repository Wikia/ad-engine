import { targetingService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

type OptimizelyVariablesType = {
	EXPERIMENT_ENABLED: string;
	EXPERIMENT_VARIANT: string;
};

export interface TargetingValues {
	[key: string]: any;
}

const logGroup = 'optimizely-service';

@Injectable()
export class OptimizelyService {
	private targetingValues: TargetingValues = {};

	getVariant(optimizelyVariables: OptimizelyVariablesType): string | undefined {
		const forcedValue = this.getForcedValue(optimizelyVariables.EXPERIMENT_VARIANT);

		if (forcedValue) {
			utils.logger(logGroup, `Experiment ${optimizelyVariables.EXPERIMENT_ENABLED} - forced value`);
			return forcedValue;
		}

		if (!this.isEnabledExperiment(optimizelyVariables.EXPERIMENT_ENABLED)) {
			utils.logger(logGroup, `Experiment ${optimizelyVariables.EXPERIMENT_ENABLED} is disabled`);
			return;
		}

		const variant = this.getVariantValue(optimizelyVariables.EXPERIMENT_VARIANT);

		this.variantToLog(optimizelyVariables, variant);

		return variant;
	}

	addVariantToTargeting(optimizelyVariables: OptimizelyVariablesType, value: string) {
		this.targetingValues[optimizelyVariables.EXPERIMENT_ENABLED] = value;

		targetingService.set('optimizely', Object.values(this.targetingValues));
	}

	private variantToLog(optimizelyVariables: OptimizelyVariablesType, variant: string | undefined) {
		if (variant == undefined) {
			utils.logger(
				logGroup,
				`Experiment ${optimizelyVariables.EXPERIMENT_VARIANT} has undefined value`,
			);
		} else {
			utils.logger(
				logGroup,
				`Experiment ${optimizelyVariables.EXPERIMENT_VARIANT} variant: ${variant}`,
			);
		}
	}

	private isEnabledExperiment(enabledVariableName: string): boolean {
		window.ads.runtime = window?.ads?.runtime || {};

		return window.ads.runtime[enabledVariableName] ?? false;
	}

	private getVariantValue(variantVariableName: string): string | undefined {
		return window?.ads?.runtime[variantVariableName] ?? undefined;
	}

	private getForcedValue(variantVariableName: string): string {
		return utils.queryString.get(`optimizely_${variantVariableName}`);
	}
}
