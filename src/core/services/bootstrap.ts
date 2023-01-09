import { context, logVersion, utils, trackingOptInWrapper } from '../index';

export class Bootstrap {
	static async setupConsent(): Promise<void> {
		logVersion();

		await trackingOptInWrapper.init();
	}

	static setupContext(basicContext: any, isMobile = false): void {
		context.extend(basicContext);
		context.set('state.isMobile', isMobile);
	}

	static setupGeo() {
		utils.geoService.setUpGeoData();
	}
}
