import { injectable } from 'tsyringe';
import { trackingUrls } from '../setup/tracking-urls';
import { DataWarehouseTracker } from './data-warehouse';

/**
 * Wrapper for labrador info warehouse trackingParams
 */
@injectable()
export class LabradorTracker {
	constructor(private dwTracker: DataWarehouseTracker) {}

	/**
	 * Track labrador info values
	 */
	track(value: string): void {
		const now = new Date();
		this.dwTracker.track(
			{
				prop_value: value,
				timestamp: now.getTime(),
				tz_offset: now.getTimezoneOffset(),
			},
			trackingUrls.AD_ENG_LABRADOR_INFO,
		);
	}
}
