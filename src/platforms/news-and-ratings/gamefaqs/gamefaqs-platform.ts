import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	LazyLoadedSlotsContextSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			GamefaqsTargetingSetup,
			NewsAndRatingsTargetingSetup,
			GamefaqsSlotsContextSetup,
			LazyLoadedSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			BiddersStateSetup,
			GamefaqsPrebidConfigSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
