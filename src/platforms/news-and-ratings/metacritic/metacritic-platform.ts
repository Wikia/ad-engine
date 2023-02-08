import { Injectable } from '@wikia/dependency-injection';

import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';

import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { MetacriticA9ConfigSetup } from './setup/context/a9/metacritic-a9-config.setup';
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
			TrackingParametersSetup,
			InstantConfigSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			NewsAndRatingsTargetingSetup,
			MetacriticTargetingSetup,
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			MetacriticPrebidConfigSetup,
			MetacriticA9ConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
		);

		this.pipeline.execute();
	}
}
