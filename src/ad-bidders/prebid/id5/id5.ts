import { context, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

const logGroup = 'Id5';

class Id5 {
	private partnerId = 1139;

	private isEnabled(): boolean {
		return (
			context.get('bidders.prebid.id5') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}

	getConfig(): UserIdConfig {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		const config = {
			name: 'id5Id',
			params: {
				partner: this.partnerId,
			},
			storage: {
				type: 'html5',
				name: 'id5id',
				expires: 90,
				refreshInSeconds: 8 * 3600,
			},
		};

		utils.logger(logGroup, 'config', config);

		return config;
	}
}

export const id5 = new Id5();
