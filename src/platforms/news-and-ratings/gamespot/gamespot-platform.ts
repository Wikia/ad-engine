import { Injectable } from '@wikia/dependency-injection';

import { context, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { NewsAndRatingsTargetingSetup } from '../shared';
import { NewsAndRatingsBaseContextSetup } from '../shared';
import { NewsAndRatingsDynamicSlotsSetup } from '../shared/setup/dynamic-slots/news-and-ratings-dynamic-slots.setup';
import { GamespotPrebidConfigSetup } from './setup/context/prebid/gamespot-prebid-config.setup';
import { GamespotAdsMode } from './modes/gamespot-ads-mode';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsTargetingSetup,
			GamespotSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			BiddersStateSetup,
			GamespotPrebidConfigSetup,
			GamespotAdsMode,
		);

		this.pipeline.execute();
	}
}
