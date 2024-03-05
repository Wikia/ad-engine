import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Triplelift extends PrebidAdapter {
	static bidderName = 'triplelift';
	bidderSettings = {
		storageAllowed: true,
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Triplelift.bidderName;
	}
	setMaximumAdSlotHeight(slotName: string, slotHeightLimit: number) {
		super.setMaximumAdSlotHeight(slotName, slotHeightLimit);
		const inventoryCodes = context.get(
			`bidders.prebid.${this.bidderName}.slots.${slotName}.inventoryCodes`,
		);

		const filteredInventoryCodes = inventoryCodes.filter((code) => {
			const size = this.extractSizeFromString(code, this.bidderName);
			return !(size && size[1] > slotHeightLimit);
		});

		context.set(
			`bidders.prebid.${this.bidderName}.slots.${slotName}.inventoryCodes`,
			filteredInventoryCodes,
		);
	}

	prepareConfigForAdUnit(
		code: string,
		{ sizes, inventoryCodes }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		const newSizes = this.filterSizesForRefreshing(code, sizes);
		// TODO inventory code
		return {
			code,
			mediaTypes: {
				banner: {
					sizes: newSizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: inventoryCodes.map((inventoryCode) => ({
				bidder: this.bidderName,
				params: {
					inventoryCode,
				},
			})),
		};
	}
}
