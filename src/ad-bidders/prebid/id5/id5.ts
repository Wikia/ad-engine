import { context, targetingService, utils } from '@ad-engine/core';
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
			context.get('bidders.prebid.id5') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}

	getConfig(): Id5Config {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		const id5AbValue: number = context.get('bidders.prebid.id5AbValue');
		if (id5AbValue) {
			utils.logger(logGroup, 'A/B testing enabled', 'value=', id5AbValue);
		} else {
			utils.logger(logGroup, 'A/B testing disabled');
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

		utils.logger(logGroup, 'config', config);

		return config;
	}

	getPartnerId(): number {
		return this.partnerId;
	}

	async trackControlGroup(pbjs: Pbjs): Promise<void> {
		const controlGroup = await this.getControlGroup(pbjs);

		utils.logger(logGroup, 'Control group', controlGroup);

		this.setTargeting(this.id5GroupKey, controlGroup);
	}

	public async getControlGroup(pbjs: Pbjs): Promise<id5GroupValue> {
		await new utils.WaitFor(
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
		utils.logger(logGroup, 'set targeting', key, value);
	}

	public enableAnalytics(pbjs: Pbjs): void {
		if (context.get('bidders.prebid.id5Analytics.enabled')) {
			utils.logger(logGroup, 'enabling ID5 Analytics');

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
