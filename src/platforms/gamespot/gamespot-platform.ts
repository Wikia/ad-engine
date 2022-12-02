import { Injectable } from '@wikia/dependency-injection';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { gptSetup } from '@platforms/shared';

import { basicContext } from '../gamefaqs/ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotDynamicSlotsSetup } from './setup/dynamic-slots/gamespot-dynamic-slots.setup';
import { NewsAndRatingsTargetingSetup } from '../shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';

@Injectable()
export class GiantBombPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// TODO: we need a CMP step here, so we won't call for ads unless we have a clear idea of the privacy policy of a visitor
			// TODO: to decide if we want to call instant-config service for the first releases?
			NewsAndRatingsTargetingSetup,
			GamespotSlotsContextSetup,
			GamespotDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}
