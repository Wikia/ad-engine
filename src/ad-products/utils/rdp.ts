import { targetingService, trackingOptIn } from '@ad-engine/core';

export function setupRdpContext(): void {
	const optedOut = trackingOptIn.isOptOutSale() ? 1 : 0;

	targetingService.set('rdp', optedOut.toString());
}
