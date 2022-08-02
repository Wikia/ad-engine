import { BaseServiceSetup, silverSurferService } from '@wikia/ad-engine';

class SilverSurferSetup extends BaseServiceSetup {
	async initialize() {
		await silverSurferService.configureUserTargeting();
		this.setInitialized();
	}
}

export const silverSurferSetup = new SilverSurferSetup();
