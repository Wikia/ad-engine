import { Injectable } from '@wikia/dependency-injection';
import { Bootstrap, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotPrebidConfigSetup } from './setup/context/prebid/gamespot-prebid-config.setup';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
} from '../shared';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => Bootstrap.setupContext(basicContext),
			Bootstrap.setupGeo,
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel InstantConfigSetup and Bootstrap.setupConsent
			InstantConfigSetup,
			Bootstrap.setupConsent,
			NewsAndRatingsTargetingSetup,
			GamespotSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			BiddersStateSetup,
			GamespotPrebidConfigSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
