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
import { ComicvineA9ConfigSetup } from './setup/context/a9/comicvine-a9-config.setup';
import { ComicvinePrebidConfigSetup } from './setup/context/prebid/comicvine-prebid-config.setup';
import { ComicvineSlotsContextSetup } from './setup/context/slots/comicvine-slots-context.setup';
import { ComicvineTargetingSetup } from './setup/context/targeting/comicvine-targeting.setup';
import { ComicvineTemplatesSetup } from './templates/comicvine-templates.setup';

@Injectable()
export class ComicvinePlatform {
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
			ComicvineTargetingSetup,
			LoadTimesSetup,
			NewsAndRatingsAnyclipSetup,
			ComicvineSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			SlotsConfigurationExtender,
			ComicvinePrebidConfigSetup,
			ComicvineA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			ComicvineTemplatesSetup,
			NewsAndRatingsAdsMode,
			SlotTrackingSetup,
			TrackingSetup,
		);

		this.pipeline.execute();
	}
}
