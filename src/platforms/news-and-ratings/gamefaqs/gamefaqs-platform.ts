import { Injectable } from '@wikia/dependency-injection';
import { Bootstrap, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
	LazyLoadedSlotsContextSetup,
} from '../shared';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => Bootstrap.setupContext(basicContext),
			Bootstrap.setupGeo,
			parallel(InstantConfigSetup, Bootstrap.setupConsent),
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			GamefaqsTargetingSetup,
			NewsAndRatingsTargetingSetup,
			GamefaqsSlotsContextSetup,
			LazyLoadedSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			GamefaqsPrebidConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
