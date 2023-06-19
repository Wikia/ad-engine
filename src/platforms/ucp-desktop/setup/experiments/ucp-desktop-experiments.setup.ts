import { DiProcess, Optimizely } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

const OPTIMIZELY_PERFORMANCE_ADS_FOR_FANATICAL = {
	EXPERIMENT_ENABLED: 'performance_ads',
	EXPERIMENT_VARIANT: 'performance_ads_variant',
};

@injectable()
export class UcpDesktopExperimentsSetup implements DiProcess {
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
