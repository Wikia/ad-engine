import { Injectable } from '@wikia/dependency-injection';
import { communicationService, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotDynamicSlotsSetup } from './setup/dynamic-slots/gamespot-dynamic-slots.setup';
import { NewsAndRatingsTargetingSetup } from '../shared';
import { NewsAndRatingsBaseContextSetup } from '../shared';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			NewsAndRatingsBaseContextSetup,
			() => bootstrapAndGetConsent(),
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
