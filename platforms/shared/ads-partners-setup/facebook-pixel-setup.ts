import { BaseServiceSetup, facebookPixel } from '@wikia/ad-engine';

class FacebookPixelSetup extends BaseServiceSetup {
	initialize() {
		facebookPixel.call();
		this.res();
	}
}

export const facebookPixelSetup = new FacebookPixelSetup();
