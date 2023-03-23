import {
	BaseSlotConfig,
	context,
	Dictionary,
	DiProcess,
	InstantConfigService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SlotsConfigurationExtender implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): Promise<void> | void {
		const slotsConfig: Dictionary<BaseSlotConfig> = this.instantConfig.get('icSlotsConfig');

		if (slotsConfig) {
			SlotsConfigurationExtender.extendSlotsConfiguration(context.get('slots'), slotsConfig);
		}
		return Promise.resolve();
	}

	private static extendSlotsConfiguration(
		slots: Dictionary<BaseSlotConfig>,
		slotsConfigExtension: Dictionary<BaseSlotConfig>,
	) {
		Object.getOwnPropertyNames(slotsConfigExtension).forEach((slotName) => {
			if (slots[slotName]) {
				SlotsConfigurationExtender.extendBaseSlotConfiguration(
					slots[slotName],
					slotsConfigExtension[slotName],
				);
			}
		});
	}

	private static extendBaseSlotConfiguration(slot: BaseSlotConfig, config: BaseSlotConfig) {
		if (Array.isArray(config.defaultSizes)) {
			slot.defaultSizes = SlotsConfigurationExtender.mergeArrayOfArraysWithoutDuplicates(
				slot.defaultSizes,
				config.defaultSizes,
			);
		}
		if (config.targeting) {
			slot.targeting = slot.targeting
				? Object.assign(slot.targeting, config.targeting)
				: config.targeting;
		}
	}

	private static mergeArrayOfArraysWithoutDuplicates(target: Array<any>, src: Array<any>) {
		if (!target) target = [];
		return Array.from(new Set([...target, ...src].map((v) => JSON.stringify(v))), (e) =>
			JSON.parse(e),
		);
	}
}
