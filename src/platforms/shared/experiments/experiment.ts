import { InstantConfigServiceInterface } from '@wikia/ad-engine';

export interface Experiment {
	enabled: boolean;
}

export abstract class SingleVariantExperiment implements Experiment {
	private readonly _enabled: boolean;

	protected constructor(
		protected instantConfig: InstantConfigServiceInterface,
		enabledVariableName: string,
	) {
		this._enabled = instantConfig.get(enabledVariableName, false);
	}

	get enabled(): boolean {
		return this._enabled;
	}
}

export abstract class MultivariantExperiment extends SingleVariantExperiment {
	private readonly variant: string;

	protected constructor(
		instantConfig: InstantConfigServiceInterface,
		enabledVariableName: string,
		variantVariableName: string,
		defaultVariant: string,
	) {
		super(instantConfig, enabledVariableName);
		this.variant = this.instantConfig.get(variantVariableName, defaultVariant);
	}

	isVariantSelected(variantName): boolean {
		return this.enabled && this.variant === variantName;
	}
}
