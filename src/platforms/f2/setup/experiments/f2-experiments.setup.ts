import { context, DiProcess, Optimizely } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const OPTIMIZELY_NTC_2_0 = {
	EXPERIMENT_ENABLED: 'unified_takeover_ntc20',
	EXPERIMENT_VARIANT: 'unified_takeover_ntc20_variant',
};

const OPTIMIZELY_NTC_2_0_VARIANTS = {
	NEW_VARIANT: 'ntc20_adhesion_enabled',
	OLD_VARIANT: 'ntc20_adhesion_disabled',
	UNDEFINED: 'ntc20_adhesion_undefined',
};

@Injectable()
export class F2ExperimentsSetup implements DiProcess {
	constructor(private optimizely: Optimizely) {}

	execute(): void {
		this.configureFloorAdhesionExperiment();
	}

	private configureFloorAdhesionExperiment() {
		this.optimizely.addVariantToTargeting(
			OPTIMIZELY_NTC_2_0,
			OPTIMIZELY_NTC_2_0_VARIANTS.UNDEFINED,
		);

		const variant = this.optimizely.getVariant(OPTIMIZELY_NTC_2_0);

		if (variant) {
			this.optimizely.addVariantToTargeting(OPTIMIZELY_NTC_2_0, variant);
			context.set('options.ntc.floorEnabled', variant === OPTIMIZELY_NTC_2_0_VARIANTS.NEW_VARIANT);
		}
	}
}
