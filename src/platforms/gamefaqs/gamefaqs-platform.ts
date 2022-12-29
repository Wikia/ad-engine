import { Injectable } from '@wikia/dependency-injection';

import { context, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { BaseContextSetup } from '../shared-news-and-ratings/context/base-context-setup';
import { GamefaqsAdsMode } from './modes/gamefaqs-ads-mode';
import { GamefaqsDynamicSlotsSetup } from './setup/dynamic-slots/gamefaqs-dynamic-slots.setup';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';
import { LazyLoadedSlotsContextSetup } from '../shared-news-and-ratings/context/lazy-loaded-slots-context.setup';
import { NewsAndRatingsTargetingSetup } from '../shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			BaseContextSetup,
			NewsAndRatingsTargetingSetup,
			GamefaqsTargetingSetup,
			GamefaqsSlotsContextSetup,
			LazyLoadedSlotsContextSetup,
			GamefaqsDynamicSlotsSetup,
			BiddersStateSetup,
			GamefaqsPrebidConfigSetup,
			GamefaqsAdsMode,
		);

		this.pipeline.execute();
	}
}
