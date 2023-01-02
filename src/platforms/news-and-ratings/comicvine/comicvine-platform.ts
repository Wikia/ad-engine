import { Injectable } from '@wikia/dependency-injection';
import { Bootstrap, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { ComicvineSlotsContextSetup } from './setup/context/slots/comicvine-slots-context.setup';
import { ComicvinePrebidConfigSetup } from './setup/context/prebid/comicvine-prebid-config.setup';
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
			() => Bootstrap.setupContextAndGeo(basicContext),
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel InstantConfigSetup and Bootstrap.setupConsent
			InstantConfigSetup,
			Bootstrap.setupConsent,
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
