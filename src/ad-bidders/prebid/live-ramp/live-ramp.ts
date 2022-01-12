import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';

const logGroup = 'LiveRamp';

class LiveRamp {
	private isDispatched = false;

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
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isDispatched) {
			userId = userId ? userId : 'undefined';
			utils.logger(logGroup, 'dispatching LiveRamp event, userId: ', userId);
			communicationService.emit(eventsRepository.LIVERAMP_IDS_LOADED, { userId });
			this.isDispatched = true;
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

export const liveRamp = new LiveRamp();
