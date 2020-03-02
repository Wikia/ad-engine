import { Dictionary } from '@ad-engine/core';

export type PrebidConfig = {
	enabled: boolean;
	lazyLoadingEnabled: boolean;
	bidsRefreshing: {
		enabled: boolean;
		slots: string[];
	};
} & Dictionary<PrebidAdapterConfig>;

export interface PrebidAdapterConfig {
	enabled: boolean;
	slots: Dictionary<PrebidAdSlotConfig>;
}

export interface PrebidAdSlotConfig {
	appId?: string | number;
	inScreen?: string;
	inventoryCodes?: string[];
	networkId?: string;
	placementId?: string | number;
	pos?: string;
	productId?: string;
	pubId?: string | number;
	siteId?: string | number;
	size?: number[];
	sizes?: [number, number][];
	unit?: string;
	zoneId?: string;
}
