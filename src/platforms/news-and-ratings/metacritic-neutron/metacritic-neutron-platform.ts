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
import { MetacriticNeutronA9ConfigSetup } from './setup/context/a9/metacritic-neutron-a9-config.setup';
import { MetacriticNeutronPrebidConfigSetup } from './setup/context/prebid/metacritic-neutron-prebid-config.setup';
import { MetacriticNeutronSlotsContextSetup } from './setup/context/slots/metacritic-neutron-slots-context.setup';
import { MetacriticNeutronTargetingSetup } from './setup/context/targeting/metacritic-neutron-targeting.setup';
import { MetacriticNeutronDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-neutron-dynamic-slots.setup';
import { MetacriticNeutronTemplatesSetup } from './templates/metacritic-neutron-templates.setup';

@Injectable()
export class MetacriticNeutronPlatform {
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
			MetacriticNeutronTargetingSetup,
			MetacriticNeutronDynamicSlotsSetup,
			MetacriticNeutronSlotsContextSetup,
			MetacriticNeutronPrebidConfigSetup,
			MetacriticNeutronA9ConfigSetup,
			BiddersStateSetup,
			MetacriticNeutronTemplatesSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
