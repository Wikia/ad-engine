import { context, DiProcess, Optimizely } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

const OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL = {
	EXPERIMENT_ENABLED: 'performance_ads',
	EXPERIMENT_VARIANT: 'performance_ads_variant',
};

const OPTIMIZELY_NTC_2_0 = {
	EXPERIMENT_ENABLED: 'unified_takeover_ntc20',
	EXPERIMENT_VARIANT: 'unified_takeover_ntc20_variant',
};

const OPTIMIZELY_NTC_2_0_VARIANTS = {
	NEW_VARIANT: 'ntc20_adhesion_enabled',
	OLD_VARIANT: 'ntc20_adhesion_disabled',
	UNDEFINED: 'ntc20_adhesion_undefined',
};

@injectable()
export class UcpDesktopExperimentsSetup implements DiProcess {
	constructor(private optimizely: Optimizely) {}

	execute(): void {
		this.configurePerformanceAdsExperiment();
		this.configureFloorAdhesionExperiment();
	}

	private configurePerformanceAdsExperiment(): void {
		const variant = this.optimizely.getVariant(OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL);

		if (variant) {
			this.optimizely.addVariantToTargeting(OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL, variant);
		}
	}

	private configureFloorAdhesionExperiment() {
		this.optimizely.addVariantToTargeting(
			OPTIMIZELY_NTC_2_0,
			OPTIMIZELY_NTC_2_0_VARIANTS.UNDEFINED,
		);

		const variant = this.optimizely.getVariant(OPTIMIZELY_NTC_2_0);

		if (variant) {
			let targetingVariantName = variant;
			const isNewVariant = variant === OPTIMIZELY_NTC_2_0_VARIANTS.NEW_VARIANT;

			if (isNewVariant) {
				targetingVariantName += (window.mw as any).config.get('isDarkTheme') ? '_dark' : '_light';
			}

			context.set('options.ntc.floorEnabled', isNewVariant);
			this.optimizely.addVariantToTargeting(OPTIMIZELY_NTC_2_0, targetingVariantName);
		}
	}
}
