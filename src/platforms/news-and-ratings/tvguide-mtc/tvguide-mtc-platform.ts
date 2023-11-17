import {
	BaseContextSetup, bootstrap,
	ConsentManagementPlatformSetup,
	InstantConfigSetup,
	MetricReporterSetup,
	NoAdsMode,
	PlatformContextSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, IdentitySetup, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { TvGuideMTCContextSetup } from './setup/wiki-context.setup';

@Injectable()
export class TvGuideMTCPlatform {
	constructor(private pipeline: ProcessPipeline) {
		context.get('services.instantConfig.endpoint');
	}

	execute(): void {
		this.pipeline.add(
			TvGuideMTCContextSetup,
			PlatformContextSetup,
			() => bootstrap(),
			parallel(InstantConfigSetup, ConsentManagementPlatformSetup),
			TrackingParametersSetup,
			MetricReporterSetup,
			BaseContextSetup,
			IdentitySetup,
			TrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
