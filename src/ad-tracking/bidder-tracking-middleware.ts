import { context, slotService, utils } from '@ad-engine/core';
import { AdBidderContext } from './bidder-tracker';

function isBidOnTime(responseTime): string {
	const biddersTimeout = context.get('bidders.timeout') || 2000;

	return responseTime > biddersTimeout ? 'too_late' : 'on_time';
}

function getSlotNamesByBidderAlias(alias: string): string[] {
	return Object.entries(slotService.slotConfigsMap)
		.filter(([name, config]) => config.bidderAlias === alias)
		.map(([name, config]) => name);
}

function getSlotNameByBidderId(id: string): string {
	let slotName = id;

	if (!context.get(`slots.${slotName}`)) {
		slotName = getSlotNamesByBidderAlias(id).shift();

		if (!slotName) {
			return '';
		}
	}

	return slotName;
}

export const bidderTrackingMiddleware: utils.Middleware<AdBidderContext> = (
	{ bid, data },
	next,
) => {
	const now = new Date();
	const timestamp: number = now.getTime();
	const slotName = getSlotNameByBidderId(bid.adUnitCode);
	const slotId = slotService.getSlotId(slotName);

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
