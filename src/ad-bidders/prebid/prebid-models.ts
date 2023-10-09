import { Dictionary } from '@ad-engine/core';

export enum PrebidVideoPlacements {
	// https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf
	IN_STREAM = 1,
	IN_BANNER = 2,
	IN_ARTICLE = 3,
	IN_FEED = 4,
	FLOATING = 5,
}

export type PrebidConfig = {
	enabled: boolean;
	bidsRefreshing: {
		slots: string[];
	};
} & Dictionary<PrebidAdapterConfig>;

export interface PrebidAdapterConfig {
	enabled: boolean;
	slots: Dictionary<PrebidAdSlotConfig>;
}

export interface PrebidAdSlotConfig {
	accountId?: string;
	adCode?: string;
	adUnitId?: string;
	alias?: string;
	assetKey?: string;
	cid?: string;
	crid?: string;
	ids?: string[];
	inScreen?: string;
	inventoryCodes?: string[];
	networkId?: string;
	parameters?: object;
	placement?: string;
	placementId?: string | number;
	publisherId?: string;
	pos?: string;
	position?: string;
	productId?: string;
	pubId?: string | number;
	site?: string | number;
	siteId?: string | number;
	size?: [number, number];
	sizeId?: string;
	sizes?: [number, number][];
	supplyCode?: string;
	targeting?: any;
	unit?: string;
	zoneId?: string;
	zoneIds?: string[];
}
