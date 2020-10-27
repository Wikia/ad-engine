import { context, trackingOptIn } from '@ad-engine/core';

// ToDo: cleanup after full TCFv2 rollout
export function setupNpaContext(): void {
	const optedOut = trackingOptIn.isOptedIn() ? 0 : 1;

	context.set('targeting.npa', optedOut.toString());
}
