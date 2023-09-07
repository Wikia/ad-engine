import { context, DiProcess, Optimizely } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

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

const OPTIMIZELY_ADHESION_NON_UAP = {
	EXPERIMENT_ENABLED: 'desktop_adhesion',
	EXPERIMENT_VARIANT: 'desktop_adhesion_variant',
};

const OPTIMIZELY_ADHESION_NON_UAP_VARIANTS = {
	CONTROL_GROUP: 'desktop_adhesion_control_group',
	SHOW_ADHESION: 'desktop_adhesion_show_adhesion',
	UNDEFINED: 'desktop_adhesion_show_undefined',
};

@Injectable()
export class UcpDesktopExperimentsSetup implements DiProcess {
	constructor(private optimizely: Optimizely) {}

	execute(): void {
		this.configurePerformanceAdsExperiment();
		this.configureFloorAdhesionExperiment();
		this.configureFloorAdhesionNonUapExperiment();
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

	private configureFloorAdhesionNonUapExperiment() {
		this.optimizely.addVariantToTargeting(
			OPTIMIZELY_ADHESION_NON_UAP,
			OPTIMIZELY_ADHESION_NON_UAP_VARIANTS.UNDEFINED,
		);

		const variant = this.optimizely.getVariant(OPTIMIZELY_ADHESION_NON_UAP);

		if (variant) {
			context.set(
				'options.isFloorAdhesionNonUapApplicable',
				variant === OPTIMIZELY_ADHESION_NON_UAP_VARIANTS.SHOW_ADHESION,
			);
			this.optimizely.addVariantToTargeting(OPTIMIZELY_ADHESION_NON_UAP, variant);
		}
	}
}
