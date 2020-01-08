import { context, slotService, utils } from '@ad-engine/core';
import { AdBidderContext } from './bidder-tracker';

function isBidOnTime(responseTime): string {
	const biddersTimeout = context.get('bidders.timeout') || 2000;

	return responseTime > biddersTimeout ? 'too_late' : 'on_time';
}

export const bidderTrackingMiddleware: utils.Middleware<AdBidderContext> = (
	{ bid, data },
	next,
) => {
	const now = new Date();
	const timestamp: number = now.getTime();
	const slotId = slotService.getId(bid.adUnitCode);

	return next({
		bid,
		data: {
			...data,
			timestamp,
			slot_id: slotId,
			name: bid.bidderCode,
			size: bid.size,
			price: bid.cpm,
			response_time: bid.timeToRespond,
			status: isBidOnTime(bid.timeToRespond),
			additional_flags: '',
		},
	});
};
