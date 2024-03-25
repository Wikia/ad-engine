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
import { context, IdentitySetup, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { MtcAdsMode } from './setup/MtcAdsMode';
import { TvGuideMtcSlotsContextSetup } from './setup/slots/tvguide-mtc-slots-context.setup';
import { TvGuideMTCContextSetup } from './setup/wiki-context.setup';

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
			TvGuideMtcSlotsContextSetup,
			MtcAdsMode,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
