// @ts-strict-ignore
import { context, targetingService, utils } from '@ad-engine/core';

interface YahooConnectIdConfig {
	name: string;
	params: {
		pixelId: string;
		he?: string; // The SHA-256 hashed user email address which has been lowercased prior to hashing
		puid?: string; // A domain-specific user identifier such as a first-party cookie
	};
	storage?: {
		type: 'cookie' | 'html5';
		name: string;
		expires?: number;
	};
}
const logGroup = 'YahooConnectId';
class YahooConnectId {
	private pixelId = '58833';

	getConfig(): YahooConnectIdConfig {
		if (!context.get('bidders.prebid.yahooConnectId.enabled')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		const config: YahooConnectIdConfig = {
			name: 'connectId',
			params: {
				pixelId: this.pixelId,
				puid: targetingService.get('ppid') || '0',
			},
			storage: {
				type: 'html5',
				name: 'connectId',
				expires: 15, // 15 is value recommended by Yahoo
			},
		};

		utils.logger(logGroup, 'config', config);

		return config;
	}
}

export const yahooConnectId = new YahooConnectId();
