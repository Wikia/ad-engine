import { context, BaseServiceSetup, utils } from '@wikia/ad-engine';
// eslint-disable-next-line no-restricted-imports
import { insertFacebookPixel } from '../../../src/ad-services/facebook-pixel/facebook-pixel-script';

const logGroup = 'facebook-pixel';

class FacebookPixelSetup extends BaseServiceSetup {
	private isEnabled(): boolean {
		return (
			context.get('services.facebookPixel.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	setup(): void {
		utils.logger(logGroup, 'loading');
		insertFacebookPixel();
	}

	initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
		} else {
			this.setup();
		}
		this.res();
	}
}

export const facebookPixelSetup = new FacebookPixelSetup();
