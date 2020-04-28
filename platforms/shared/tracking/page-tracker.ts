import { Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';

/**
 * Wrapper for page info warehouse trackingParams
 */
@Injectable()
export class PageTracker {
	constructor(private dwTracker: DataWarehouseTracker) {}

	/**
	 * Track page info prop values
	 */
	trackProp(name: string, value: string): void {
		const now = new Date();
		const trackingPropsURL =
			'https://beacon.wikia-services.com/__track/special/adengpageinfo_props';

		this.dwTracker.track(
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
