import { context, utils } from '@wikia/ad-engine';
import { cmpWrapper } from './cmp/cmp-wrapper';

export async function bootstrapAndGetCmpConsent(): Promise<boolean> {
	const geo = utils.geoService.setUpGeoData().country;

	context.set('custom.isCMPEnabled', cmpWrapper.geoRequiresConsent(geo));
	context.set('options.geoRequiresConsent', cmpWrapper.geoRequiresConsent(geo));

	await cmpWrapper.init();

	return cmpWrapper.getConsent(geo);
}
