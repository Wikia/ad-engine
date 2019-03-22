import { Dictionary } from '@wikia/ad-engine';

export interface AdUnitConfig {
	bids: Bid[];
	code: string;
	mediaType?: string;
	mediaTypes?: {
		banner?: {
			sizes: number[][];
		};
		video?: {
			context?: string;
			playerSize: number[];
		};
	};
	sizes?: number[];
}

export interface Aliases {
	[key: string]: string[];
}

export interface Bid {
	bidder: string;
	params?: Dictionary<string | number | object | boolean>;
}

export interface BidderAdSlotConfig {
	appId?: string | number;
	placementId?: string | number;
	pos?: string;
	size?: number[];
	sizes?: number[][];
	siteId?: string | number;
	unit?: string;
}

export abstract class BaseAdapter {
	static bidderName: string;
	aliases?: Aliases;
	isCustomBidAdapter = false;

	enabled: boolean;
	slots: any;

	constructor({ enabled, slots }) {
		this.enabled = enabled;
		this.slots = slots;
	}

	abstract prepareConfigForAdUnit(code: string, config: BidderAdSlotConfig): AdUnitConfig;

	abstract get bidderName(): string;

	prepareAdUnits(): AdUnitConfig[] {
		return Object.keys(this.slots).map((slotName) =>
			this.prepareConfigForAdUnit(slotName, this.slots[slotName]),
		);
	}
}
