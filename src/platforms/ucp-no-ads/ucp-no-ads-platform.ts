import {
	AdEnginePhasesSetup,
	BaseContextSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	MetricReporterSetup,
	NoAdsMode,
	PlatformContextSetup,
	PostAdStackPartnersSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	adEnginePhases,
	IdentitySetup,
	logVersion,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@Injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		logVersion();

		this.pipeline.add(
			AdEnginePhasesSetup,
			UcpNoAdsWikiContextSetup,
			PlatformContextSetup,
			async () => await ensureGeoCookie(),
			async () => await adEnginePhases.configuration,
			parallel(InstantConfigSetup, ConsentManagementPlatformSetup),
			TrackingParametersSetup,
			MetricReporterSetup,
			BaseContextSetup,
			IdentitySetup,
			TrackingSetup,
			NoAdsMode,
			async () => await adEnginePhases.partners,
			PostAdStackPartnersSetup,
		);
		this.pipeline.execute();
	}
}
