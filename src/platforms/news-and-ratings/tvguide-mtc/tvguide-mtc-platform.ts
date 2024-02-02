import { parallel, ProcessPipeline } from '@ad-engine/pipeline';
import {
	BaseContextSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	MetricReporterSetup,
	NoAdsMode,
	PlatformContextSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { IdentitySetup } from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';
import { TvGuideMTCContextSetup } from './setup/wiki-context.setup';

@Injectable()
export class TvGuideMTCPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			TvGuideMTCContextSetup,
			PlatformContextSetup,
			async () => await ensureGeoCookie(),
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
