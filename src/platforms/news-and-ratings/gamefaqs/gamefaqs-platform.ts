import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
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
import { GamefaqsA9ConfigSetup } from './setup/context/a9/gamefaqs-a9-config.setup';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';
import { GamefaqsAnyclipApplierSetup } from './setup/context/video/gamefaqs-anyclip-applier.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			NewsAndRatingsTargetingSetup,
			GamefaqsTargetingSetup,
			GamefaqsAnyclipApplierSetup,
			GamefaqsSlotsContextSetup,
			LazyLoadedSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			GamefaqsPrebidConfigSetup,
			GamefaqsA9ConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
