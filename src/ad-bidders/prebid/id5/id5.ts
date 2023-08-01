import { context, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

const logGroup = 'Id5';

class Id5 {
	getConfig(): UserIdConfig {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		return {
			name: 'id5Id',
			params: {
				partner: 1139,
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

	private isEnabled(): boolean {
		return context.get('bidders.prebid.id5') && !context.get('') && !utils.isCoppaSubject();
	}
}

export const id5 = new Id5();
