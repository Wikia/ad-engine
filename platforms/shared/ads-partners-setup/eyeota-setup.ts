import { BaseServiceSetup, eyeota } from '@wikia/ad-engine';

class EyeotaSetup extends BaseServiceSetup {
	async initialize() {
		await eyeota.call();
		this.res();
	}
}

export const eyeotaSetup = new EyeotaSetup();
