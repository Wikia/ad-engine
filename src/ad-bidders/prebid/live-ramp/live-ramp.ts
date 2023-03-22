import { context, utils } from '@ad-engine/core';

const logGroup = 'LiveRamp';

interface LiveRampConfig {
	userSync?: {
		userIds: object[];
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
							pid: '2161',
						},
						storage: {
							type: 'cookie',
							name: 'idl_env',
							expires: 1,
						},
					},
				],
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
