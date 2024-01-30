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
import { IdentitySetup, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { MtcAdsMode } from './setup/MtcAdsMode';
import { TvGuideSlotsContextSetup } from './setup/slots/tvguide-slots-context.setup';
import { TvGuideMTCContextSetup } from './setup/wiki-context.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@Injectable()
export class TvGuideMTCPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			parallel(InstantConfigSetup, ConsentManagementPlatformSetup),
			TvGuideMTCContextSetup,
			PlatformContextSetup,
			async () => await ensureGeoCookie(),
			TrackingParametersSetup,
			MetricReporterSetup,
			BaseContextSetup,
			IdentitySetup,
			TrackingSetup,
			TvGuideTemplatesSetup,
			TvGuideSlotsContextSetup,
			MtcAdsMode,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
