import { Injectable } from '@wikia/dependency-injection';
import { context, ProcessPipeline } from '@wikia/ad-engine';
import { startAdEngine } from '@platforms/shared';

import { basicContext } from './ad-context';

@Injectable()
export class PlayerOnePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => {
				startAdEngine();
			},
		);

		this.pipeline.execute();
	}
}
