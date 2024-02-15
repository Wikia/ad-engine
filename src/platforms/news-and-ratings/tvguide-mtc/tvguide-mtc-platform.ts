import { context } from '@ad-engine/core';
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
import { basicContext } from './ad-context';
import { MtcAdsMode } from './setup/MtcAdsMode';
import { TvGuideMtcSlotsContextSetup } from './setup/slots/tvguide-mtc-slots-context.setup';
import { TvGuideMTCContextSetup } from './setup/wiki-context.setup';
import { TvGuideMtcTemplatesSetup } from './templates/tvguide-mtc-templates.setup';

@Injectable()
export class TvGuideMTCPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		context.extend(basicContext);
		this.pipeline.add(
			parallel(InstantConfigSetup, ConsentManagementPlatformSetup),
			BaseContextSetup,
			PlatformContextSetup,
			async () => await ensureGeoCookie(),
			TrackingParametersSetup,
			MetricReporterSetup,
			IdentitySetup,
			TrackingSetup,
			TvGuideMTCContextSetup,
			TvGuideMtcTemplatesSetup,
			TvGuideMtcSlotsContextSetup,
			MtcAdsMode,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
