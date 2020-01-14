import { utils } from '@wikia/ad-engine';
import { trackingOptInWrapper } from './consent/tracking-opt-in-wrapper';

export async function bootstrapAndGetConsent(): Promise<void> {
	const geoData = utils.geoService.setUpGeoData();

	await trackingOptInWrapper.init(geoData);

	trackingOptInWrapper.getConsent();
	trackingOptInWrapper.getSignal();
	trackingOptInWrapper.flushConsentQueue();
}
