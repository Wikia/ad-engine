import { Injectable } from '@wikia/dependency-injection';
import { communicationService, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { startAdEngine } from '@platforms/shared';

import { PlayerOneBaseContextSetup } from './setup/context/base/player-one-base-context.setup';
import { PlayerOneSlotsSetup } from './setup/context/slots/player-one-slots.setup';

@Injectable()
export class PlayerOnePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			// TODO: we need a CMP step here, so we won't call for ads unless we have a clear idea of the privacy policy of a visitor
			// TODO: to decide if we want to call instant-config service for the first releases?
			PlayerOneBaseContextSetup, // TODO: this setup step will require some kind of taxonomy data from the apps
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			PlayerOneSlotsSetup, // TODO: add slot setup based on domain/platform context
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			() => {
				startAdEngine();
			},
		);

		this.pipeline.execute();
	}
}
