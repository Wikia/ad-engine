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
import { context, IdentitySetup, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@Injectable()
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
			IdentitySetup,
			TrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
