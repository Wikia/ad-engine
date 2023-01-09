import { bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { NewsAndRatingsAdsMode, NewsAndRatingsBaseContextSetup } from '../shared';
import { basicContext } from './ad-context';
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
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			NewsAndRatingsAdsMode,
		);

		this.pipeline.execute();
	}
}
