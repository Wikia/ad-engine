import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { NewsAndRatingsAdsMode, NewsAndRatingsBaseContextSetup } from '../shared';
import { basicContext } from './ad-context';
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
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsBaseContextSetup,
			TvGuideTargetingSetup,
			TvGuideDynamicSlotsSetup,
			TvGuideSlotsContextSetup,
			TvGuidePrebidConfigSetup,
			BiddersStateSetup,
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
