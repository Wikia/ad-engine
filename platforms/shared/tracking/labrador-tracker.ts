import { Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';

/**
 * Wrapper for labrador info warehouse trackingParams
 */
@Injectable()
export class LabradorTracker {
	constructor(private dwTracker: DataWarehouseTracker) {}

	/**
	 * Track labrador info values
	 */
	track(value: string): void {
		const now = new Date();
		const trackingURL = 'https://beacon.wikia-services.com/__track/special/adenglabradorinfo';

		this.dwTracker.track(
			{
				prop_value: value,
				timestamp: now.getTime(),
				tz_offset: now.getTimezoneOffset(),
			},
			trackingURL,
		);
	}
}
