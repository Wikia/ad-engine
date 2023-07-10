import {
	BaseContextSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	MetricReporter,
	MetricReporterSetup,
	NoAdsMode,
	PlatformContextSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {
		context.get('services.instantConfig.endpoint');
	}

	execute(): void {
		this.pipeline.add(
			UcpNoAdsWikiContextSetup,
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			MetricReporterSetup,
			MetricReporter,
			BaseContextSetup,
			TrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
