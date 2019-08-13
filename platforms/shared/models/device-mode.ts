export type DeviceMode = 'desktop' | 'mobile';

export interface BidderContextRepository {
	// @ts-ignore
	[key: DeviceMode]: any;
}

export function getDeviceMode(): DeviceMode {
	return window.matchMedia('(max-width: 840px)').matches ? 'mobile' : 'desktop';
}
