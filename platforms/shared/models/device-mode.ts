export type DeviceMode = 'desktop' | 'mobile';

export interface BidderContextRepository {
	// @ts-ignore No need to create map object type if it's either desktop or mobile
	[key: DeviceMode]: any;
}

export function getDeviceMode(): DeviceMode {
	return window.matchMedia('(max-width: 840px)').matches ? 'mobile' : 'desktop';
}
