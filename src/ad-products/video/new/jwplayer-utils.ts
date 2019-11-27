import { AdSlot, VastParams } from '@ad-engine/core';

export const EMPTY_VAST_CODE = 21009;

export function updateSlotParams(adSlot: AdSlot, vastParams: VastParams): void {
	adSlot.lineItemId = vastParams.lineItemId;
	adSlot.creativeId = vastParams.creativeId;
	adSlot.creativeSize = vastParams.size;
}
