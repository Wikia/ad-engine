import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'LiveRamp';

class LiveRamp {
	getConfig() {
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

	dispatchLiveRampPrebidIdsLoadedEvent(userId): void {
		if (this.isEnabled()) {
			communicationService.dispatch(liveRampPrebidIdsLoadedEvent({ userId }));
		}
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.liveRampId.enabled') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}
}

export const liveRampPrebidIdsLoadedEvent = globalAction(
	'[AdEngine] LiveRamp Prebid ids loaded',
	props<{ userId: string }>(),
);

export const liveRamp = new LiveRamp();
