import { Injectable } from '@wikia/dependency-injection';

import { bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline } from '@wikia/ad-engine';

import { NewsAndRatingsAdsMode, NewsAndRatingsBaseContextSetup } from '../shared';
import { basicContext } from './ad-context';
import { MetacriticNeutronSlotsContextSetup } from './setup/context/slots/metacritic-neutron-slots-context.setup';
import { MetacriticNeutronTargetingSetup } from './setup/context/targeting/metacritic-neutron-targeting.setup';
import { MetacriticNeutronDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-neutron-dynamic-slots.setup';

@Injectable()
export class MetacriticNeutronPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsBaseContextSetup,
			MetacriticNeutronTargetingSetup,
			MetacriticNeutronDynamicSlotsSetup,
			MetacriticNeutronSlotsContextSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
