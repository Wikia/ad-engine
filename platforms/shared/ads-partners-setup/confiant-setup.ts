import { BaseServiceSetup, confiant } from '@wikia/ad-engine';

class ConfiantSetup extends BaseServiceSetup {
	async initialize() {
		await confiant.call();
		this.res();
	}
}

export const confiantSetup = new ConfiantSetup();
