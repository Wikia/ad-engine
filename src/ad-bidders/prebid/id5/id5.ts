import { context, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

const logGroup = 'Id5';
interface Id5Config extends UserIdConfig {
	params: {
		abTesting: {
			enabled: boolean;
			controlGroupPct: number;
		};
	};
}

class Id5 {
	getConfig(): Id5Config {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		const config = {
			name: 'id5Id',
			params: {
				partner: 1139,
				abTesting: {
					enabled: false,
					controlGroupPct: 0.5,
				},
			},
			storage: {
				type: 'html5',
				name: 'id5id',
				expires: 90,
				refreshInSeconds: 8 * 3600,
			},
		};

		// Configure A/B testing
		const id5AbValue = context.get('bidders.prebid.id5AbValue');

		if (id5AbValue && id5AbValue !== 0) {
			utils.logger(logGroup, 'A/B testing enabled', 'value', id5AbValue);
			config.params.abTesting.enabled = true;
			config.params.abTesting.controlGroupPct = id5AbValue;
		} else {
			utils.logger(logGroup, 'A/B testing disabled');
		}

		utils.logger(logGroup, 'config', config);

		return config;
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
