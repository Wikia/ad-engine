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
	slots: Dictionary<PrebidAdapterConfig>;
}

export interface PrebidAdSlotConfig {
	appId?: string | number;
	inScreen?: string;
	inventoryCodes?: string[];
	networkId?: string;
	pageId?: string;
	placementId?: string | number;
	pos?: string;
	productId?: string;
	siteId?: string | number;
	size?: number[];
	sizes?: [number, number][];
	unit?: string;
}
