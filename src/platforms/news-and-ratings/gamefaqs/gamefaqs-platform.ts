import { Injectable } from '@wikia/dependency-injection';
import { Bootstrap, ProcessPipeline } from '@wikia/ad-engine';
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
} from '../shared';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => Bootstrap.setupContextAndGeo(basicContext),
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel InstantConfigSetup and Bootstrap.setupConsent
			InstantConfigSetup,
			Bootstrap.setupConsent,
			NewsAndRatingsWadSetup,
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
