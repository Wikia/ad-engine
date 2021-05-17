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
				this.isLoaded = true;
				this.setup();
			}
		}, 2000);
	}

	private setup(): void {
		// @ts-ignore
		if (window.SilverSurferSDK.isInitialized()) {
			// @ts-ignore
			window.SilverSurferSDK.getUserProfile().then((result) => console.log('silverSurfer', result));
		}
	}
}

export const silverSurfer = new SilverSurfer();
