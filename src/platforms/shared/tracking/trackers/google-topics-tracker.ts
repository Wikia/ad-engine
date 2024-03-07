import { targetingService } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export async function googleTopicsTracker(dwTracker: DataWarehouseTracker): Promise<void> {
	if (targetingService.get('topics_available') !== '1') {
		return;
	}

	// @ts-expect-error Google Topics API is not available in TS dom lib
	const topics: unknown[] = await document.browsingTopics({ skipObservation: true });
	dwTracker.track(
		{
			ppid: targetingService.get('ppid'),
			topic: JSON.stringify(topics),
		},
		trackingUrls.TOPICS,
	);
}
