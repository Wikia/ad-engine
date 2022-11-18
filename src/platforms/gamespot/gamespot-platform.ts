import { Injectable } from '@wikia/dependency-injection';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { startAdEngine } from '@platforms/shared';

import { basicContext } from '../gamefaqs/ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotDynamicSlotsSetup } from './setup/dynamic-slots/gamespot-dynamic-slots.setup';

@Injectable()
export class GiantBombPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			// TODO: we need a CMP step here, so we won't call for ads unless we have a clear idea of the privacy policy of a visitor
			// TODO: to decide if we want to call instant-config service for the first releases?
			GamespotSlotsContextSetup,
			GamespotDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			() => {
				startAdEngine();
			},
		);

		this.pipeline.execute();
	}
}
