import { Injectable } from '@wikia/dependency-injection';
import { Bootstrap, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { BiddersStateSetup, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { NewsAndRatingsAdsMode, NewsAndRatingsBaseContextSetup } from '../shared';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config-setup.service';

@Injectable()
export class TvGuidePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => Bootstrap.setupContext(basicContext),
			Bootstrap.setupGeo,
			parallel(InstantConfigSetup, Bootstrap.setupConsent),
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
