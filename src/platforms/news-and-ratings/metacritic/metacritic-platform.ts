import { Injectable } from '@wikia/dependency-injection';

import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';

import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { MetacriticPrebidConfigSetup } from './setup/context/prebid/metacritic-prebid-config.setup';
import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticTargetingSetup } from './setup/context/targeting/metacritic-targeting.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';

@Injectable()
export class MetacriticPlatform {
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
			MetacriticTargetingSetup,
			NewsAndRatingsTargetingSetup,
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			MetacriticPrebidConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
