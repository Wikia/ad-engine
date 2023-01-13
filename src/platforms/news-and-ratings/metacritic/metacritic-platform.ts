import { Injectable } from '@wikia/dependency-injection';

import { Bootstrap, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';

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
			() => Bootstrap.setupContext(basicContext),
			Bootstrap.setupGeo,
			parallel(InstantConfigSetup, Bootstrap.setupConsent),
			NewsAndRatingsBaseContextSetup,
			MetacriticTargetingSetup,
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			MetacriticPrebidConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
