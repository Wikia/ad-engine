import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config-setup.service';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';

@Injectable()
export class TvGuidePlatform {
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
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			TvGuideSlotsContextSetup,
			TvGuideDynamicSlotsSetup,
			TvGuidePrebidConfigSetup,
			TvGuideA9ConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
