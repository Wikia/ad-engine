import { bidderTracker, context, Dictionary } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function bidderDwTracker(dwTracker: DataWarehouseTracker): void {
	if (!context.get('bidders.prebid.enabled') && !context.get('bidders.a9.enabled')) {
		return;
	}

	bidderTracker.register(({ data }: Dictionary) => {
		dwTracker.track(data, trackingUrls.AD_ENG_BIDDERS);
	});
}
