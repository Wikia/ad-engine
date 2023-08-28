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

type id5GroupValue = 'A' | 'B' | 'U';
const logGroup = 'Id5';

class Id5 {
	private partnerId = 1139;
	private storage;
	private id5GroupKey = 'id5_group';

	constructor() {
		this.storage = new UniversalStorage();
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.prebid.id5') &&
			context.get('options.adsAllowed') &&
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

	async setupAbTesting(pbjs: Pbjs): Promise<void> {
		const controlGroup =
			this.getControlGroupFromStorage() || (await this.getControlGroupFromPbjsObject(pbjs));

		utils.logger(logGroup, 'Control group', controlGroup);

		this.setTargeting(this.id5GroupKey, controlGroup);

		if (controlGroup && controlGroup !== 'U') {
			this.saveInStorage(this.id5GroupKey, controlGroup);
		}
	}

	private getControlGroupFromStorage(): id5GroupValue {
		const storageValue = this.storage.getItem(this.id5GroupKey);

		if (storageValue !== null) {
			return storageValue;
		}
	}

	private async getControlGroupFromPbjsObject(pbjs: Pbjs): Promise<id5GroupValue> {
		await new utils.WaitFor(() => pbjs.getUserIds()?.id5id?.ext !== undefined, 10, 20).until();

		const controlGroup = pbjs.getUserIds()?.id5id?.ext?.abTestingControlGroup;

		if (controlGroup === undefined) {
			return 'U';
		}

		return controlGroup === true ? 'A' : 'B';
	}

	private saveInStorage(key: string, value: string) {
		if (this.storage.getItem(key) !== null) {
			return;
		}

		this.storage.setItem(this.id5GroupKey, value);
		utils.logger(logGroup, key, 'saved in storage', value);
	}

	private setTargeting(key: string, value: string): void {
		targetingService.set(key, value);
		utils.logger(logGroup, 'set targeting', key, value);
	}
}

export const id5 = new Id5();
