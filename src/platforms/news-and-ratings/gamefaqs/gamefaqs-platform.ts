import { Injectable } from '@wikia/dependency-injection';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsWadSetup,
			GamefaqsTargetingSetup,
			NewsAndRatingsTargetingSetup,
			GamefaqsSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			BiddersStateSetup,
			GamefaqsPrebidConfigSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
