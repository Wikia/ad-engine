import { DataWarehouseTracker } from './data-warehouse';

/**
 * Wrapper for page info warehouse trackingParams
 */
export class PageTracker {
	/**
	 * Track page info prop values
	 */
	static trackProp(name: string, value: string): void {
		const now = new Date();
		const dataWarehouseTracker = new DataWarehouseTracker();
		const trackingPropsURL =
			'https://beacon.wikia-services.com/__track/special/adengpageinfo_props';

		dataWarehouseTracker.track(
			{
				prop_name: name,
				prop_value: value,
				timestamp: now.getTime(),
				tz_offset: now.getTimezoneOffset(),
			},
			trackingPropsURL,
		);
	}
}
