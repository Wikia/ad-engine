import { utils } from '@wikia/ad-engine';
import { cmpWrapper } from './cmp/cmp-wrapper';

export async function bootstrapAndGetCmpConsent(): Promise<boolean> {
	const geoData = utils.geoService.setUpGeoData();

	await cmpWrapper.init(geoData);

	return cmpWrapper.getConsent();
}
