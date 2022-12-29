import { Aliases, context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidAdapterConfig, PrebidAdSlotConfig } from './prebid-models';

export const DEFAULT_MAX_CPM = 20;
export const EXTENDED_MAX_CPM = 50;

export abstract class PrebidAdapter {
	static bidderName: string;
	aliases?: Aliases;
	isCustomBidAdapter = false;
	maxCpm = DEFAULT_MAX_CPM;

	enabled: boolean;
	slots: any;
	pageTargeting: Dictionary;

	constructor({ enabled, slots }: PrebidAdapterConfig) {
		this.enabled = enabled;
		this.slots = slots;
		this.pageTargeting = {
			...(targetingService.getAll() || {}),
		};

		Object.keys(this.pageTargeting).forEach((key) => {
			if (!Array.isArray(this.pageTargeting[key])) {
				this.pageTargeting[key] = [this.pageTargeting[key]];
			}
		});
	}

	abstract prepareConfigForAdUnit(code: string, config: PrebidAdSlotConfig): PrebidAdUnit;

	abstract get bidderName(): string;

	prepareAdUnits(): PrebidAdUnit[] {
		return Object.keys(this.slots).map((slotName) =>
			this.prepareConfigForAdUnit(slotName, this.slots[slotName]),
		);
	}

	protected getTargeting(placementName: string, customTargeting = {}): Dictionary {
		return {
			...this.pageTargeting,
			src: context.get('src') || [''],
			pos: [placementName],
			...customTargeting,
		};
	}
}
