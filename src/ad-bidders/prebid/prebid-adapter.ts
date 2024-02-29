import { Aliases, context, Dictionary, targetingService, utils } from '@ad-engine/core';
import { PrebidAdapterConfig, PrebidAdSlotConfig } from './prebid-models';

interface BidderSettings {
	storageAllowed?: boolean | string[];
}

export abstract class PrebidAdapter {
	static bidderName: string;
	aliases?: Aliases;
	isCustomBidAdapter = false;

	enabled: boolean;
	slots: any;
	pageTargeting: Dictionary;
	bidderSettings?: BidderSettings;

	constructor({ enabled, slots }: PrebidAdapterConfig) {
		this.enabled = enabled;
		this.slots = slots;
		this.pageTargeting = {
			...(targetingService.dump() || {}),
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

	protected getOrtb2Imp(code: string) {
		return {
			ext: {
				gpid: this.getGPIDValue(code),
			},
		};
	}

	private getGPIDValue(code: string): string {
		return utils.stringBuilder.build(context.get('adUnitId'), {
			slotConfig: {
				adProduct: code,
				group: 'PB',
				slotNameSuffix: '',
			},
		});
	}

	setMaximumAdSlotHeight(slotName: string, slotHeightLimit: number) {
		const sizeKey = context.get(`bidders.prebid.${this.bidderName}.slots.${slotName}`);
		const filterCallback = (size: [number, number]) => size[1] <= slotHeightLimit;
		if (!sizeKey || !('sizes' in sizeKey)) return;

		context.set(
			`bidders.prebid.${this.bidderName}.slots.${slotName}.sizes`,
			context
				.get(`bidders.prebid.${this.bidderName}.slots.${slotName}.sizes`)
				.filter(filterCallback),
		);
	}

	extractSizeFromString(input: string, type: 'pubmatic' | 'triplelift'): number[] | null {
		let regex: RegExp;

		if (type === 'pubmatic') {
			regex = /@(\d+)x(\d+)/;
		} else if (type === 'triplelift') {
			regex = /_(\d+)x(\d+)_/;
		} else {
			throw new Error('Invalid type specified');
		}

		const match = input.match(regex);

		if (match) {
			const width = parseInt(match[1], 10);
			const height = parseInt(match[2], 10);
			return [width, height];
		}

		return null;
	}
}
