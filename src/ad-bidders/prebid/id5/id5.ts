import { context, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

const logGroup = 'Id5';

class Id5 {
	private partnerId = 1139;

	getConfig(): UserIdConfig {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		return {
			name: 'id5Id',
			params: {
				partner: this.partnerId,
				abTesting: {
					enabled: false,
					controlGroupPct: 0.1,
				},
			},
			storage: {
				type: 'html5',
				name: 'id5id',
				expires: 90,
				refreshInSeconds: 8 * 3600,
			},
		};
	}

	getPartnerId(): number {
		return this.partnerId;
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.prebid.id5') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}
}

export const id5 = new Id5();
