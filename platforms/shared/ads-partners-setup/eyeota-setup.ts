import { BaseServiceSetup, eyeota } from '@wikia/ad-engine';

class EyeotaSetup extends BaseServiceSetup {
	async initialize() {
		await eyeota.call();
		this.setInitialized();
	}
}

export const eyeotaSetup = new EyeotaSetup();
