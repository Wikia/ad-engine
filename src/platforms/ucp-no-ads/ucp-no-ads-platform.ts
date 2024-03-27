import {
	BaseContextSetup,
	ConsentManagementPlatformSetup,
	ensureGeoAvailable,
	InstantConfigSetup,
	MetricReporterSetup,
	NoAdsMode,
	PlatformContextSetup,
	TrackingParametersSetup,
} from '@platforms/shared';
import { IdentitySetup, logVersion, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpNoAdsBaseContextSetup } from './setup/context/base/ucp-no-ads-base-context.setup';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';
import { UcpNoAdsTrackingSetup } from './tracking/tracking.setup';

@Injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		logVersion();

		this.pipeline.add(
			UcpNoAdsWikiContextSetup,
			PlatformContextSetup,
			async () => await ensureGeoAvailable(),
			parallel(InstantConfigSetup),
			TrackingParametersSetup,
			MetricReporterSetup,
			UcpNoAdsBaseContextSetup,
			IdentitySetup,
			UcpNoAdsTrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
