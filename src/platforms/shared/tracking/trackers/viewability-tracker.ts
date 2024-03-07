import { Dictionary, viewabilityTracker } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function viewabilityDwTracker(dwTracker: DataWarehouseTracker): void {
	viewabilityTracker.register(({ data }: Dictionary) => {
		dwTracker.track(data, trackingUrls.AD_ENG_VIEWABILITY);

		return data;
	});
}
