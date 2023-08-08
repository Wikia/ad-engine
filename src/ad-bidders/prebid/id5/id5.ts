import { context, targetingService, UniversalStorage, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

interface Id5Config extends UserIdConfig {
	params: {
		abTesting: {
			enabled: boolean;
			controlGroupPct: number;
		};
	};
}

type id5GroupValue = '1' | '0';
const logGroup = 'Id5';

class Id5 {
	private storage;
	private id5GroupKey = 'id5_group';

	constructor() {
		this.storage = new UniversalStorage();
	}

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

		const config = {
			name: 'id5Id',
			params: {
				partner: 1139,
				abTesting: {
					enabled: false,
					controlGroupPct: 0.5,
				},
			},
			storage: {
				type: 'html5',
				name: 'id5id',
				expires: 90,
				refreshInSeconds: 8 * 3600,
			},
		};

		this.configureAbTestingParameters(config);

		utils.logger(logGroup, 'config', config);

		return config;
	}

	private configureAbTestingParameters(config: Id5Config): void {
		const id5AbValue = context.get('bidders.prebid.id5AbValue');

		if (id5AbValue && typeof id5AbValue === 'number') {
			config.params.abTesting.enabled = true;
			config.params.abTesting.controlGroupPct = id5AbValue;

			utils.logger(logGroup, 'A/B testing enabled', 'value', id5AbValue);
		} else {
			utils.logger(logGroup, 'A/B testing disabled');
		}
	}

	async setupAbTesting(pbjs: Pbjs): Promise<void> {
		const controlGroup =
			this.getControlGroupFromStorage() || (await this.getControlGroupFromPbjsObject(pbjs));

		utils.logger(logGroup, 'Control group', controlGroup);

		if (!controlGroup) {
			return;
		}

		this.saveInStorage(this.id5GroupKey, controlGroup);
		this.setControlGroupAsTargetingParam(controlGroup);
	}

	private getControlGroupFromStorage(): id5GroupValue {
		const storageValue = this.storage.getItem(this.id5GroupKey);

		if (storageValue !== null && typeof storageValue === 'number') {
			return storageValue === 1 ? '1' : '0';
		}
	}

	private async getControlGroupFromPbjsObject(pbjs: Pbjs): Promise<id5GroupValue> {
		await new utils.WaitFor(() => pbjs.getUserIds()?.id5id?.ext !== undefined, 10, 20).until();

		return pbjs.getUserIds()?.id5id?.ext?.abTestingControlGroup === true ? '1' : '0';
	}

	private saveInStorage(key: string, value: string) {
		if (this.storage.getItem(key) !== null) {
			return;
		}

		this.storage.setItem(this.id5GroupKey, value);
		utils.logger(logGroup, key, 'saved in storage', value);
	}

	private setControlGroupAsTargetingParam(controlGroup: id5GroupValue): void {
		targetingService.set(this.id5GroupKey, controlGroup);
		utils.logger(logGroup, 'Control group set as targeting param', controlGroup);
	}
}

export const id5 = new Id5();
