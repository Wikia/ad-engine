import { utils } from '@wikia/ad-engine';
import { cmpWrapper } from './cmp/cmp-wrapper';

export async function bootstrapAndGetCmpConsent(): Promise<boolean> {
	const countryCode = utils.geoService.setUpGeoData().country;

	await cmpWrapper.init(countryCode);

	return cmpWrapper.getConsent();
}
