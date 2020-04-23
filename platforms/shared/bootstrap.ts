import { utils } from '@wikia/ad-engine';
import { trackingOptInWrapper } from './consent/tracking-opt-in-wrapper';

export async function bootstrapAndGetConsent(): Promise<void> {
	utils.geoService.setUpGeoData();

	await trackingOptInWrapper.init();

	trackingOptInWrapper.getConsent();
	trackingOptInWrapper.getSignal();
	trackingOptInWrapper.flushConsentQueue();
}
