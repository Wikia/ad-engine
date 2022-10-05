import { slotService } from '@ad-engine/core';
import { CompilerPartial } from '../base-tracker';

function isBidOnTime(slotName: string, responseTime: number): boolean {
	const slot = slotService.get(slotName);

	if (!slot || !slot.getPushTime()) {
		return true;
	}

	return slot.getPushTime() > responseTime;
}

export const bidderTrackingCompiler = ({ bid, data }: CompilerPartial): CompilerPartial => {
	const now = new Date();
	const timestamp: number = now.getTime();
	const slotId = slotService.getSlotId(bid.slotName);
	const additionalFlags: string[] = [];

	if (bid.buyerId) {
		additionalFlags.push(`buyer_id=${bid.buyerId}`);
	}

	return {
		bid,
		data: {
			...data,
			timestamp,
			slot_id: slotId,
			name: bid.bidderName,
			size: bid.size,
			price: bid.price,
			response_time: bid.timeToRespond,
			status: isBidOnTime(bid.slotName, bid.responseTimestamp) ? 'on_time' : 'too_late',
			additional_flags: additionalFlags.join(';'),
		},
	};
};
