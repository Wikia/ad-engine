import { context, slotService, utils } from '@ad-engine/core';
import { AdBidderContext } from './bidder-tracker';

function isBidOnTime(slotName: string, responseTime: number): boolean {
	const slot = slotService.get(slotName);

	if (!slot || !slot.getPushTime()) {
		return true;
	}

	return slot.getPushTime() > responseTime;
}

function getSlotNamesByBidderAlias(alias: string): string[] {
	return Object.entries(slotService.slotConfigsMap)
		.filter(([name, config]) => config.bidderAlias === alias)
		.map(([name, config]) => name);
}

function getSlotNameByBidderId(id: string): string {
	let slotName = id;

	if (Object.entries(context.get(`slots.${slotName}`) || {}).length === 0) {
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
			status: isBidOnTime(slotName, bid.responseTimestamp) ? 'on_time' : 'too_late',
			additional_flags: '',
		},
	});
};
