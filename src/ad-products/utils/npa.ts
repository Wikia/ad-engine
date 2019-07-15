import { context, trackingOptIn } from '@ad-engine/core';

export function setupNpaContext() {
	const optedOut = trackingOptIn.isOptedIn() ? 0 : 1;

	context.set('targeting.npa', optedOut.toString());
}
