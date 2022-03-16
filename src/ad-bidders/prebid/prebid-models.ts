import { Dictionary } from '@ad-engine/core';

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
	adCode?: string;
	alias?: string;
	appId?: string | number;
	cid?: string;
	crid?: string;
	ids?: string[];
	inScreen?: string;
	inventoryCodes?: string[];
	networkId?: string;
	parameters?: object;
	placement?: string;
	placementId?: string | number;
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
	uid?: string | number;
	unit?: string;
	zoneId?: string;
}
