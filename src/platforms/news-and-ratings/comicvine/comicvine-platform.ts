import {
	BiddersStateSetup,
	bootstrap,
	ConsentManagementPlatformSetup,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporter,
	MetricReporterSetup,
	PreloadedLibrariesSetup,
	SlotsConfigurationExtender,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	context,
	IdentitySetup,
	parallel,
	ProcessPipeline,
	sequential,
	utils,
} from '@wikia/ad-engine';
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
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			() => bootstrap(),
			parallel(
				sequential(InstantConfigSetup, PreloadedLibrariesSetup),
				ConsentManagementPlatformSetup,
			),
			TrackingParametersSetup,
			MetricReporterSetup,
			MetricReporter,
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
			TrackingSetup,
		);

		this.pipeline.execute();
	}
}
