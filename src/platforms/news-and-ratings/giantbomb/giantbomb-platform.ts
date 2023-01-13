import { Injectable } from '@wikia/dependency-injection';
import { Bootstrap, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { GiantbombSlotsContextSetup } from './setup/context/slots/giantbomb-slots-context.setup';
import { GiantbombPrebidConfigSetup } from './setup/context/prebid/giantbomb-prebid-config.setup';
import { GiantbombTargetingSetup } from './setup/context/targeting/giantbomb-targeting.setup';
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
			() => Bootstrap.setupContext(basicContext),
			Bootstrap.setupGeo,
			parallel(InstantConfigSetup, Bootstrap.setupConsent),
			NewsAndRatingsBaseContextSetup,
			GiantbombTargetingSetup,
			NewsAndRatingsTargetingSetup,
			GiantbombSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			GiantbombPrebidConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
