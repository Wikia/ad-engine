import { DiProcess, Optimizely } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL = {
	EXPERIMENT_ENABLED: 'mobile_performance_ads',
	EXPERIMENT_VARIANT: 'mobile_performance_ads_variant',
};

@Injectable()
export class UcpMobileExperimentsSetup implements DiProcess {
	constructor(private optimizely: Optimizely) {}

	execute(): void {
		this.configurePerformanceAdsExperiment();
	}

	private configurePerformanceAdsExperiment(): void {
		const variant = this.optimizely.getVariant(OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL);

		if (variant) {
			this.optimizely.addVariantToTargeting(OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL, variant);
		}
	}
}
