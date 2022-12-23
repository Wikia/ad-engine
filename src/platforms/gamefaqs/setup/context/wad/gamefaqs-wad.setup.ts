import { Injectable } from '@wikia/dependency-injection';

import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';

@Injectable()
export class GameFaqsWadSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): Promise<void> | void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (babEnabled) {
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
		}
	}
}
