import { ctaTracker, Dictionary } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function ctaDwTracker(dwTracker: DataWarehouseTracker): void {
	ctaTracker.register(({ data }: Dictionary) => {
		dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
	});
}
