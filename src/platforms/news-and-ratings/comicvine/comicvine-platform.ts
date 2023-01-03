import { Injectable } from '@wikia/dependency-injection';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { ComicvineSlotsContextSetup } from './setup/context/slots/comicvine-slots-context.setup';
import { ComicvinePrebidConfigSetup } from './setup/context/prebid/comicvine-prebid-config.setup';
import { ComicvineTargetingSetup } from './setup/context/targeting/comicvine-targeting.setup';
import {
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsAdsMode,
} from '../shared';

@Injectable()
export class ComicvinePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			ComicvineTargetingSetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsDynamicSlotsSetup,
			ComicvineSlotsContextSetup,
			BiddersStateSetup,
			ComicvinePrebidConfigSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
