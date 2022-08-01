import { BaseServiceSetup, durationMedia } from '@wikia/ad-engine';

class DurationMediaSetup extends BaseServiceSetup {
	async initialize() {
		await durationMedia.call();
		this.res();
	}
}

export const durationMediaSetup = new DurationMediaSetup();
