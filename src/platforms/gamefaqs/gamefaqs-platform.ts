import { Injectable } from '@wikia/dependency-injection';
import { communicationService, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { gptSetup } from '@platforms/shared';

import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsDynamicSlotsSetup } from './setup/dynamic-slots/gamefaqs-dynamic-slots.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			// TODO: we need a CMP step here, so we won't call for ads unless we have a clear idea of the privacy policy of a visitor
			// TODO: to decide if we want to call instant-config service for the first releases?
			GamefaqsSlotsContextSetup,
			GamefaqsDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}
