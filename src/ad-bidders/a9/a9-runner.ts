import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { Bidders } from '../index';
import { A9Provider } from './index';

const logGroup = 'A9Runner';

export class A9Runner extends BaseServiceSetup {
	call(): Promise<void> {
		const config = context.get('bidders') || {};

		if (A9Provider.isEnabled()) {
			Bidders.biddersProviders.a9 = new A9Provider(config.a9, config.timeout);
		} else {
			utils.logger(logGroup, 'A9 has been disabled');
		}

		return;
	}
}
