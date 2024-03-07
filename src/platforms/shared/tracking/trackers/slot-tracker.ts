import { Bidders, context, Dictionary, slotTracker } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function slotDwTracker(dwTracker: DataWarehouseTracker, bidders: Bidders): void {
	let withBidders = null;

	if (context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled')) {
		withBidders = bidders;
	}

	slotTracker.onChangeStatusToTrack.push('top-conflict');
	slotTracker.register(
		({ data }: Dictionary) => {
			dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
		},
		{ bidders: withBidders },
	);
}
