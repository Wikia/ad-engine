import { Injectable } from '@wikia/dependency-injection';

import { context, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';
import { MetacriticPrebidConfigSetup } from './setup/context/prebid/metacritic-prebid-config.setup';
import { MetacriticTargetingSetup } from './setup/context/targeting/metacritic-targeting.setup';
import { NewsAndRatingsAdsMode, NewsAndRatingsBaseContextSetup } from '../shared';

@Injectable()
export class MetacriticPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			MetacriticTargetingSetup,
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			BiddersStateSetup,
			MetacriticPrebidConfigSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
