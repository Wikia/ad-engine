import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	NewsAndRatingsAdsMode,
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
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TrackingParametersSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			NewsAndRatingsTargetingSetup,
			ComicvineTargetingSetup,
			NewsAndRatingsDynamicSlotsSetup,
			ComicvineSlotsContextSetup,
			ComicvinePrebidConfigSetup,
			ComicvineA9ConfigSetup,
			BiddersStateSetup,
			ComicvineTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
		);

		this.pipeline.execute();
	}
}
