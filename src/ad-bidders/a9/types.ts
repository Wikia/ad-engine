import { Dictionary } from '@ad-engine/core';
import { BidderConfig, BidsRefreshing } from '../bidder-provider';

export type PriceMap = Dictionary<string>;

export interface ApstagConfig extends Partial<A9CCPA> {
	pubID: string;
	videoAdServer: 'DFP';
	deals: boolean;
}

export interface A9CCPA {
	params: {
		us_privacy: string;
	};
}

export interface A9Config extends BidderConfig {
	amazonId: string;
	slots: Dictionary<A9SlotConfig>;
	videoEnabled: boolean;
	bidsRefreshing: BidsRefreshing;
}

export interface A9BidConfig {
	slots: A9SlotDefinition[];
	timeout: number;
}

export interface A9SlotConfig {
	sizes: number[][];
	type: 'display' | 'video';
	slotId?: string;
}

export interface A9Bids {
	[slotName: string]: {
		[targetingKey: string]: string;
	};
}

export interface A9SlotDefinition {
	slotID: string;
	slotName: string;
	mediaType?: 'display' | 'video';
	sizes?: number[][];
}

export interface A9Bid {
	slotID: string;
	mediaType: string;
	size: string;
	targeting: A9Targeting;
	helpers: {
		targetingKeys: string[];
	};
}

export type A9Targeting = {
	amzniid: string;
	amznbid: string;
	amznp: string;
	amznsz: string;
	amzniid_sp: string;
	amznbid_sp: string;
	amznp_sp: string;
	amznsz_sp: string;
	amzndeal_sp: string;
	amzndeals?: string[];
} & { [key: string]: string };
