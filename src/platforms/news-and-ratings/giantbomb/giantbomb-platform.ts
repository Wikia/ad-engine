import { Injectable } from '@wikia/dependency-injection';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { GiantbombSlotsContextSetup } from './setup/context/slots/giantbomb-slots-context.setup';
import { GiantbombPrebidConfigSetup } from './setup/context/prebid/giantbomb-prebid-config.setup';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
} from '../shared';

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
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
