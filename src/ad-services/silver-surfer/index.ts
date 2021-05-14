import { context, utils } from '@ad-engine/core';

const logGroup = 'silver-surfer';

class SilverSurfer {
	private isLoaded = false;

	private isEnabled(): boolean {
		return context.get('services.silverSurfer.enabled');
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		setTimeout(() => {
			if (!this.isLoaded) {
				utils.logger(logGroup, 'loading');
				// @ts-ignore
				if (window.SilverSurferSDK.isInitialized()) {
					this.isLoaded = true;
					utils.logger(logGroup, 'loaded');
					this.setup();
				}
			}
		}, 2000);
	}

	private setup(): void {
		// @ts-ignore
		window.SilverSurferSDK.getUserProfile().then((result) => console.log(result));
	}
}

export const silverSurfer = new SilverSurfer();
