// @ts-strict-ignore
import { context, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

const logGroup = 'LiveRamp';

export abstract class LiveRampIdTypes {
	static PLACEMENT_ID = '2161';
	static ENVELOPE_STORAGE_NAME = 'idl_env';
}

class LiveRampId {
	getConfig(): UserIdConfig {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');
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
			!utils.isCoppaSubject()
		);
	}
}

export const liveRampId = new LiveRampId();
