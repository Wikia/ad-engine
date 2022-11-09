import { Injectable } from '@wikia/dependency-injection';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { startAdEngine } from '@platforms/shared';

import { SlotDestroyerSetup } from './setup/slot-destroyer.setup';
import { PlayerOneContextSetup } from './setup/player-one-context-setup';

@Injectable()
export class PlayerOnePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			// TODO: we need a CMP step here, so we won't call for ads unless we have a clear idea of the privacy policy of a visitor
			// TODO: to decide if we want to call instant-config service for the first releases?
			SlotDestroyerSetup, // TODO: remove before going to production (and after we figure out how to disable previous ad logic when enabling AdEngine)
			PlayerOneContextSetup, // TODO: this setup step will require some kind of taxonomy data from the apps
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			() => {
				// TODO: to decide if we need SRA or if separate calls are OK?
				context.push('state.adStack', { id: 'leader_plus_top' });
				context.push('state.adStack', { id: 'mpu_plus_top' });

				startAdEngine();
			},
		);

		this.pipeline.execute();
	}
}
