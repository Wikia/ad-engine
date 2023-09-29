import { context, utils } from '@ad-engine/core';
import { Ats } from '../ats';
import { UserIdConfig } from '../index';

const logGroup = 'LiveRamp';

class LiveRamp {
	getConfig(): UserIdConfig {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');
		return {
			name: 'identityLink',
			params: {
				pid: Ats.PLACEMENT_ID,
			},
			storage: {
				type: 'html5',
				name: Ats.ENVELOPE_STORAGE_NAME,
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

export const liveRamp = new LiveRamp();
