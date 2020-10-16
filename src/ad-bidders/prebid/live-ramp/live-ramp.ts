import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';

const logGroup = 'LiveRamp';

class LiveRamp {
	getConfig() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return {};
		}

		utils.logger(logGroup, 'enabled');
		this.dispatchLiveRampPrebidIdsLoadedEvent();
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
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	private dispatchLiveRampPrebidIdsLoadedEvent(): void {
		communicationService.dispatch(liveRampPrebidIdsLoadedEvent());
	}
}

export const liveRampPrebidIdsLoadedEvent = globalAction('[AdEngine] LiveRamp Prebid ids loaded');

export const liveRamp = new LiveRamp();
