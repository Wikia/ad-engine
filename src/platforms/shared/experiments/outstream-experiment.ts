import { InstantConfigServiceInterface } from '@wikia/ad-engine';
import { MultivariantExperiment } from './experiment';

export class OutstreamExperiment extends MultivariantExperiment {
	constructor(instantConfig: InstantConfigServiceInterface) {
		super(instantConfig, 'icOutstreamExperimentEnabled', 'icOutstreamExperiment', 'distroscale');
	}

	isExco(): boolean {
		return this.isVariantSelected('exco');
	}

	isConnatix(): boolean {
		return this.isVariantSelected('connatix');
	}

	isAnyclip(): boolean {
		return this.isVariantSelected('anyclip');
	}
}
