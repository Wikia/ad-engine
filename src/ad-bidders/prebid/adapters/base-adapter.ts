export const DEFAULT_MAX_CPM = 20;
export const EXTENDED_MAX_CPM = 50;

export interface Aliases {
	[key: string]: string[];
}

export interface BidderAdSlotConfig {
	appId?: string | number;
	inScreen?: string;
	placementId?: string | number;
	pos?: string;
	size?: number[];
	sizes?: [number, number][];
	siteId?: string | number;
	unit?: string;
}

export abstract class BaseAdapter {
	static bidderName: string;
	aliases?: Aliases;
	isCustomBidAdapter = false;
	maxCpm = DEFAULT_MAX_CPM;

	enabled: boolean;
	slots: any;

	constructor({ enabled, slots }) {
		this.enabled = enabled;
		this.slots = slots;
	}

	abstract prepareConfigForAdUnit(code: string, config: BidderAdSlotConfig): PrebidAdUnit;

	abstract get bidderName(): string;

	prepareAdUnits(): PrebidAdUnit[] {
		return Object.keys(this.slots).map((slotName) =>
			this.prepareConfigForAdUnit(slotName, this.slots[slotName]),
		);
	}
}
