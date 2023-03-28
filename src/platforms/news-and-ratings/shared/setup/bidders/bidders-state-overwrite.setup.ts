import { Injectable } from '@wikia/dependency-injection';

import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';

@Injectable()
export class BiddersStateOverwriteSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): Promise<void> | void {
		if (this.instantConfig.get('icA9Bidder') && this.instantConfig.get('icA9VideoBidder')) {
			context.set('bidders.a9.videoEnabled', true);
		}
	}
}
