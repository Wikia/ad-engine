import {
	communicationService,
	context,
	eventsRepository,
	logVersion,
	utils,
} from '@wikia/ad-engine';

export async function bootstrapAndGetConsent(): Promise<void> {
	logVersion();

	utils.geoService.setUpGeoData();
	return new Promise((resolve) => {
		communicationService.on(eventsRepository.IDENTITY_SDK_READY, () => {
			window.ie.getConsents().then((consents) => {
				utils.logger('consents', consents);
				context.set('options.trackingOptIn', consents.tracking);
				context.set('options.optOutSale', consents.optOutSale);
			});
			return resolve();
		});
	});
}
