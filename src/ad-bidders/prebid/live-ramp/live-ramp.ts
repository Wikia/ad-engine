import { context, utils } from '@ad-engine/core';
import { Ats } from '../ats';

const logGroup = 'LiveRamp';

export interface LiveRampConfig {
	userSync?: {
		userIds: object[];
		syncDelay: number;
	};
}

class LiveRamp {
	getConfig(): LiveRampConfig {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return {};
		}

		utils.logger(logGroup, 'enabled');
		return {
			userSync: {
				userIds: [
					{
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
					},
				],
				syncDelay: 3000,
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
