import { BaseServiceSetup, silverSurferService } from '@wikia/ad-engine';

class SilverSurferSetup extends BaseServiceSetup {
	async initialize() {
		await silverSurferService.configureUserTargeting();
		this.res();
	}
}

export const silverSurferSetup = new SilverSurferSetup();
