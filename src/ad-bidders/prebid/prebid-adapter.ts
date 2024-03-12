import { Aliases, context, Dictionary, targetingService } from '@ad-engine/core';
import { stringBuilder } from '@ad-engine/utils';
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
		return stringBuilder.build(context.get('adUnitId'), {
			slotConfig: {
				adProduct: code,
				group: 'PB',
				slotNameSuffix: '',
			},
		});
	}
}
