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
	siteId?: string | number;
	inScreen?: string;
	placementId?: string | number;
	pos?: string;
	size?: number[];
	sizes?: [number, number][];
	unit?: string;
}
