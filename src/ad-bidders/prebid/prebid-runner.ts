import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { Bidders } from '../index';
import { PrebidProvider } from './index';

const logGroup = 'PrebidRunner';

export class PrebidRunner extends BaseServiceSetup {
	call(): Promise<void> {
		const config = context.get('bidders') || {};

		if (config.prebid && config.prebid.enabled) {
			Bidders.biddersProviders.prebid = new PrebidProvider(config.prebid, config.timeout);
		} else {
			utils.logger(logGroup, 'Prebid has been disabled');
		}

		return;
	}
}
