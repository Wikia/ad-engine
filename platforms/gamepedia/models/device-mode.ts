export type DeviceMode = 'desktop' | 'mobile';

export interface BidderContextRepository {
	// @ts-ignore
	[key: DeviceMode]: any;
}
