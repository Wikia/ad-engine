import { Injectable } from '@wikia/dependency-injection';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { NewsAndRatingsTargetingSetup } from '../shared';
import { NewsAndRatingsBaseContextSetup } from '../shared';
import { NewsAndRatingsDynamicSlotsSetup } from '../shared/setup/dynamic-slots/news-and-ratings-dynamic-slots.setup';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			() => bootstrapAndGetConsent(),
			// TODO: to decide if we want to call instant-config service for the first releases?
			NewsAndRatingsTargetingSetup,
			GamespotSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}
