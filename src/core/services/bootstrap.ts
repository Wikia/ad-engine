import { context, logVersion, utils, trackingOptInWrapper } from '../index';

export class Bootstrap {
	static async getConsent(): Promise<void> {
		logVersion();

		await trackingOptInWrapper.init();
	}

	static setUpContextAndGeo(basicContext: any, isMobile = false): void {
		context.extend(basicContext);
		utils.geoService.setUpGeoData();
		context.set('state.isMobile', isMobile);
	}
}
