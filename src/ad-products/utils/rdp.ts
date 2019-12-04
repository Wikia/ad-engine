import { context, trackingOptIn } from '@ad-engine/core';

export function setupRdpContext(): void {
	const optedOut = trackingOptIn.isOptOutSale() ? 1 : 0;

	context.set('targeting.rdp', optedOut.toString());
}
