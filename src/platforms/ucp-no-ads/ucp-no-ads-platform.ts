import { parallel, ProcessPipeline } from '@ad-engine/pipeline';
import { logVersion } from '@ad-engine/utils';
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
			BaseContextSetup,
			IdentitySetup,
			TrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
