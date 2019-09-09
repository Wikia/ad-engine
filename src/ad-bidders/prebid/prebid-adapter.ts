import { Aliases, context } from '@ad-engine/core';
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

	constructor({ enabled, slots }: PrebidAdapterConfig) {
		this.enabled = enabled;
		this.slots = slots;
	}

	abstract prepareConfigForAdUnit(code: string, config: PrebidAdSlotConfig): PrebidAdUnit;

	abstract get bidderName(): string;

	prepareAdUnits(): PrebidAdUnit[] {
		return Object.keys(this.slots).map((slotName) =>
			this.prepareConfigForAdUnit(slotName, this.slots[slotName]),
		);
	}

	protected getTargeting(slotName) {
		return {
			pos: [slotName],
			...(context.get('bidders.prebid.targeting') || {}),
		};
	}
}
