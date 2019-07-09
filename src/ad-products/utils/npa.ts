import { context, trackingOptIn } from '@wikia/ad-engine';

export function setupNpaContext() {
	const optedOut = trackingOptIn.isOptedIn() ? 0 : 1;

	context.set('targeting.npa', optedOut.toString());
}
