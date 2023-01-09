import { Injectable } from '@wikia/dependency-injection';

import { Bootstrap, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';

import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';
import { MetacriticPrebidConfigSetup } from './setup/context/prebid/metacritic-prebid-config.setup';
import { NewsAndRatingsAdsMode, NewsAndRatingsBaseContextSetup } from '../shared';

@Injectable()
export class MetacriticPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => Bootstrap.setupContext(basicContext),
			Bootstrap.setupGeo,
			// once we have Geo cookie set on varnishes we can parallel InstantConfigSetup and Bootstrap.setupConsent
			InstantConfigSetup,
			Bootstrap.setupConsent,
			NewsAndRatingsBaseContextSetup,
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			BiddersStateSetup,
			MetacriticPrebidConfigSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
