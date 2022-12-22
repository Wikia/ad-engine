import { logVersion, utils } from '@wikia/ad-engine';
import { trackingOptInWrapper } from './consent/tracking-opt-in-wrapper';

export async function bootstrapAndGetConsent(): Promise<void> {
	logVersion();

	await trackingOptInWrapper.init();

	utils.geoService.setUpGeoData();
}
