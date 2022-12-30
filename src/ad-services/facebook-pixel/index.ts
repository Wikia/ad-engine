import { BaseServiceSetup, utils } from '@ad-engine/core';
import { insertFacebookPixel } from './facebook-pixel-script';

const logGroup = 'facebook-pixel';

class FacebookPixel extends BaseServiceSetup {
	isSetUp = false;

	setup(): void {
		utils.logger(logGroup, 'loading');
		insertFacebookPixel();
	}

	call(): void {
		if (!this.isEnabled('services.facebookPixel.enabled')) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		if (!this.isSetUp) {
			this.setup();
			this.isSetUp = true;
		}
	}
}

export const facebookPixel = new FacebookPixel();
