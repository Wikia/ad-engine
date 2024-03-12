import { context } from '@ad-engine/core';
import { parallel, ProcessPipeline, sequential } from '@ad-engine/pipeline';
import { client, logVersion } from '@ad-engine/utils';
import {
	BiddersStateSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporterSetup,
	PreloadedLibrariesSetup,
	SlotsConfigurationExtender,
	SlotTrackingSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { IdentitySetup } from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';
import {
	BiddersStateOverwriteSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsAnyclipSetup,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { GiantbombA9ConfigSetup } from './setup/context/a9/giantbomb-a9-config.setup';
import { GiantbombPrebidConfigSetup } from './setup/context/prebid/giantbomb-prebid-config.setup';
import { GiantbombSlotsContextSetup } from './setup/context/slots/giantbomb-slots-context.setup';
import { GiantbombTargetingSetup } from './setup/context/targeting/giantbomb-targeting.setup';
import { GiantbombTemplatesSetup } from './templates/giantbomb-templates.setup';

@Injectable()
export class GiantbombPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		logVersion();
		context.extend(basicContext);
		context.set('state.isMobile', !client.isDesktop());

		this.pipeline.add(
			async () => await ensureGeoCookie(),
			parallel(
				sequential(InstantConfigSetup, PreloadedLibrariesSetup),
				ConsentManagementPlatformSetup,
			),
			TrackingParametersSetup,
			MetricReporterSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			IdentitySetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			GiantbombTargetingSetup,
			LoadTimesSetup,
			GiantbombSlotsContextSetup,
			SlotsConfigurationExtender,
			NewsAndRatingsDynamicSlotsSetup,
			GiantbombPrebidConfigSetup,
			GiantbombA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			GiantbombTemplatesSetup,
			NewsAndRatingsAdsMode,
			SlotTrackingSetup,
			TrackingSetup,
		);

		this.pipeline.execute();
	}
}
