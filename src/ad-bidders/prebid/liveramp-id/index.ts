import { context } from '@ad-engine/core';
import { isCoppaSubject, logger } from '@ad-engine/utils';
import { UserIdConfig } from '../index';

const logGroup = 'LiveRamp';

export abstract class LiveRampIdTypes {
	static PLACEMENT_ID = '2161';
	static ENVELOPE_STORAGE_NAME = 'idl_env';
}

class LiveRampId {
	getConfig(): UserIdConfig {
		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return;
		}

		logger(logGroup, 'enabled');
		return {
			name: 'identityLink',
			params: {
				pid: LiveRampIdTypes.PLACEMENT_ID,
			},
			storage: {
				type: 'html5',
				name: LiveRampIdTypes.ENVELOPE_STORAGE_NAME,
				expires: 1,
				refreshInSeconds: 1800,
			},
		};
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.liveRampId.enabled') &&
			!context.get('options.optOutSale') &&
			!isCoppaSubject()
		);
	}
}

export const liveRampId = new LiveRampId();
