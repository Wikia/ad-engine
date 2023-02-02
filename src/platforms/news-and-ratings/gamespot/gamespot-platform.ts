import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { GamespotA9ConfigSetup } from './setup/context/a9/gamespot-a9-config.setup';
import { GamespotPrebidConfigSetup } from './setup/context/prebid/gamespot-prebid-config.setup';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotTargetingSetup } from './setup/context/targeting/gamespot-targeting.setup';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			NewsAndRatingsTargetingSetup,
			GamespotTargetingSetup,
			GamespotSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			GamespotPrebidConfigSetup,
			GamespotA9ConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
