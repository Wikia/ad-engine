import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';

const logGroup = 'LiveRamp';

interface LiveRampConfig {
	userSync?: {
		userIds: object[];
	};
}

class LiveRamp {
	private isDispatched = false;

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

	dispatchLiveRampPrebidIdsLoadedEvent(userId): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isDispatched) {
			const user = userId ? userId : 'undefined';
			utils.logger(logGroup, 'dispatching LiveRamp event, userId: ', user);
			communicationService.emit(eventsRepository.LIVERAMP_IDS_LOADED, { user });
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
