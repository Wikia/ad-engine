import { Injectable } from '@wikia/dependency-injection';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsDynamicSlotsSetup } from './setup/dynamic-slots/gamefaqs-dynamic-slots.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// TODO: to decide if we want to call instant-config service for the first releases?
			() => bootstrapAndGetConsent(),
			GamefaqsSlotsContextSetup,
			GamefaqsDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}
