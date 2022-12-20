import { Injectable } from '@wikia/dependency-injection';
import { communicationService, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';
import { NewsAndRatingsBaseContextSetup } from '../shared';

@Injectable()
export class MetacriticPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			NewsAndRatingsBaseContextSetup,
			() => bootstrapAndGetConsent(),
			// TODO: to decide if we want to call instant-config service for the first releases?
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}
