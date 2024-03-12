import { Injectable } from '@wikia/dependency-injection';

import { context, InstantConfigService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

@Injectable()
export class BiddersStateOverwriteSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): Promise<void> | void {
		if (this.instantConfig.get('icA9Bidder') && this.instantConfig.get('icA9VideoBidder')) {
			context.set('bidders.a9.videoEnabled', true);
		}
		context.set('bidders.s2s.bidders', this.instantConfig.get('icPrebidS2sBidders', []));
		context.set('bidders.s2s.enabled', this.instantConfig.get('icPrebidS2sBidders', []).length > 0);
	}
}
