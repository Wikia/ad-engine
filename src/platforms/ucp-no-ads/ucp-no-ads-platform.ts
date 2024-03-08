import {
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	MetricReporterSetup,
	PlatformContextSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { IdentitySetup, logVersion, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpNoAdsBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@Injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		logVersion();

		this.pipeline.add(
			UcpNoAdsWikiContextSetup,
			PlatformContextSetup,
			async () => await ensureGeoCookie(),
			parallel(InstantConfigSetup, ConsentManagementPlatformSetup),
			TrackingParametersSetup,
			MetricReporterSetup,
			UcpNoAdsBaseContextSetup,
			IdentitySetup,
			TrackingSetup,
		);
		this.pipeline.execute();
	}
}
