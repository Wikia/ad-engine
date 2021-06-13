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
		const labradorTrackingURL =
			'https://beacon.wikia-services.com/__track/special/labradorpageview';

		this.dwTracker.track(
			{
				prop_name: name,
				prop_value: value,
				timestamp: now.getTime(),
				tz_offset: now.getTimezoneOffset(),
			},
			trackingPropsURL,
		);

		if (name === 'labrador') {
			this.dwTracker.track(
				{
					value,
					timestamp: now.getTime(),
					tz_offset: now.getTimezoneOffset(),
				},
				labradorTrackingURL,
			);
		}
	}
}
