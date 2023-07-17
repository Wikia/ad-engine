import { context, logVersion, utils } from '@wikia/ad-engine';

export async function bootstrapAndGetConsent(): Promise<void> {
	!window.ie && (await new utils.WaitFor(() => !!window.ie, 1000, 10));

	logVersion();

	utils.geoService.setUpGeoData();

	return window.ie.getConsents().then((consents) => {
		context.set('options.trackingOptIn', consents.tracking);
		context.set('options.optOutSale', consents.optOutSale);
	});
}
