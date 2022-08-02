import { BaseServiceSetup, optimera } from '@wikia/ad-engine';

class OptimeraSetup extends BaseServiceSetup {
	async initialize() {
		await optimera.call();
		this.setInitialized();
	}
}

export const optimeraSetup = new OptimeraSetup();
