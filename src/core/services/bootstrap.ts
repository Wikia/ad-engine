import { context, logVersion, utils, trackingOptInWrapper } from '../index';

export class Bootstrap {
	static async setupConsent(): Promise<void> {
		logVersion();

		await trackingOptInWrapper.init();
	}

	static setupContextAndGeo(basicContext: any, isMobile = false): void {
		context.extend(basicContext);
		utils.geoService.setUpGeoData();
		context.set('state.isMobile', isMobile);
	}
}
