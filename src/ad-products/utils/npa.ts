import { targetingService, trackingOptIn } from '@ad-engine/core';

// @TODO: cleanup after full TCFv2 rollout
export function setupNpaContext(): void {
	const optedOut = trackingOptIn.isOptedIn() ? 0 : 1;

	targetingService.set('npa', optedOut.toString());
}
