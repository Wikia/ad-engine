import { context, utils } from '@ad-engine/core';
import { insertFacebookPixel } from './facebook-pixel-script';

const logGroup = 'facebook-pixel';

class FacebookPixel {
	isSetUp = false;

	private isEnabled(): boolean {
		return (
			context.get('services.facebookPixel.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	setup(): void {
		insertFacebookPixel();
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		utils.logger(logGroup, 'loading');
		this.setup();
		this.isSetUp = true;
	}
}

export const facebookPixel = new FacebookPixel();
