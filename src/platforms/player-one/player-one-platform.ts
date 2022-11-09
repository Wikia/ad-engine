import { Injectable } from '@wikia/dependency-injection';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { startAdEngine } from '@platforms/shared';

import { SlotDestroyerSetup } from './setup/slot-destroyer.setup';
import { PlayerOneContextSetup } from './setup/player-one-context-setup';

@Injectable()
export class PlayerOnePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			// TODO: we need a CMP step here, so we won't call for ads unless we have a clear idea of the privacy policy of a visitor
			SlotDestroyerSetup, // TODO: remove before going to production (and after we figure out how to disable previous ad logic when enabling AdEngine)
			PlayerOneContextSetup,
			() => {
				context.push('state.adStack', { id: 'leader_plus_top' });
				context.push('state.adStack', { id: 'mpu_plus_top' });

				startAdEngine();
			},
		);

		this.pipeline.execute();
	}
}
