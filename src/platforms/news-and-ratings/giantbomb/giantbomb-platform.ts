import { Injectable } from '@wikia/dependency-injection';

import { context, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GiantbombSlotsContextSetup } from './setup/context/slots/giantbomb-slots-context.setup';
import { NewsAndRatingsTargetingSetup } from '../shared';
import { NewsAndRatingsBaseContextSetup } from '../shared';
import { NewsAndRatingsDynamicSlotsSetup } from '../shared/setup/dynamic-slots/news-and-ratings-dynamic-slots.setup';
import { GiantbombPrebidConfigSetup } from './setup/context/prebid/giantbomb-prebid-config.setup';
import { GiantbombAdsMode } from './modes/giantbomb-ads-mode';

@Injectable()
export class GiantbombPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsTargetingSetup,
			GiantbombSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			BiddersStateSetup,
			GiantbombPrebidConfigSetup,
			GiantbombAdsMode,
		);

		this.pipeline.execute();
	}
}
