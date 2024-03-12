import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, targetingService } from '@ad-engine/core';
import { isCoppaSubject, logger, WaitFor } from '@ad-engine/utils';
import { UserIdConfig } from '../index';

interface Id5Config extends UserIdConfig {
	params: {
		abTesting: {
			enabled: boolean;
			controlGroupPct: number;
		};
	};
}

type id5GroupValue = 'A' | 'B' | 'U';
const logGroup = 'Id5';

class Id5 {
	private partnerId = 1139;
	private id5GroupKey = 'id5_group';

	private isEnabled(): boolean {
		return (
			context.get('bidders.prebid.id5') && !context.get('options.optOutSale') && !isCoppaSubject()
		);
	}

	getConfig(): Id5Config {
		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return;
		}

		logger(logGroup, 'enabled');
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'id5_start',
		});

		const id5AbValue: number = context.get('bidders.prebid.id5AbValue');
		if (id5AbValue) {
			logger(logGroup, 'A/B testing enabled', 'value=', id5AbValue);
		} else {
			logger(logGroup, 'A/B testing disabled');
		}

		const config = {
			name: 'id5Id',
			params: {
				partner: this.partnerId,
				abTesting: {
					enabled: id5AbValue !== undefined,
					controlGroupPct: id5AbValue,
				},
			},
			storage: {
				type: 'html5',
				name: 'id5id',
				expires: 90,
				refreshInSeconds: 8 * 3600,
			},
		};

		logger(logGroup, 'config', config);

		return config;
	}

	getPartnerId(): number {
		return this.partnerId;
	}

	async trackControlGroup(pbjs: Pbjs): Promise<void> {
		const controlGroup = await this.getControlGroup(pbjs);

		logger(logGroup, 'Control group', controlGroup);

		this.setTargeting(this.id5GroupKey, controlGroup);
	}

	public async getControlGroup(pbjs: Pbjs): Promise<id5GroupValue> {
		await new WaitFor(
			() => pbjs.getUserIds()?.id5id?.ext?.abTestingControlGroup !== undefined,
			10,
			20,
		).until();
		const isUserInControlGroup = pbjs.getUserIds()?.id5id?.ext?.abTestingControlGroup;

		if (isUserInControlGroup === undefined) {
			return 'U';
		}

		return isUserInControlGroup === true ? 'B' : 'A';
	}

	private setTargeting(key: string, value: string): void {
		targetingService.set(key, value);
		logger(logGroup, 'set targeting', key, value);
	}

	public enableAnalytics(pbjs: Pbjs): void {
		if (context.get('bidders.prebid.id5Analytics.enabled')) {
			logger(logGroup, 'enabling ID5 Analytics');

			pbjs.enableAnalytics({
				provider: 'id5Analytics',
				options: {
					partnerId: this.partnerId,
				},
			});
		}
	}
}

export const id5 = new Id5();
