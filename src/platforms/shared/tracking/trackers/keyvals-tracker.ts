import { targetingService } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function keyValsDwTracker(dwTracker: DataWarehouseTracker): void {
	const keyVals = { ...targetingService.dump() };

	// Remove Audigent segments
	delete keyVals.AU_SEG;

	dwTracker.track(
		{
			keyvals: JSON.stringify(keyVals),
		},
		trackingUrls.KEY_VALS,
	);
}
