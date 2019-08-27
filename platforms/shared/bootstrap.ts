import { utils } from '@wikia/ad-engine';
import { cmpWrapper } from './cmp/cmp-wrapper';

export async function bootstrapAndGetCmpConsent(): Promise<boolean> {
	const geo = utils.geoService.setUpGeoData().country;

	await cmpWrapper.init(geo);

	return cmpWrapper.getConsent(geo);
}
