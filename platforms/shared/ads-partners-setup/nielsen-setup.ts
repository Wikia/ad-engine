import { BaseServiceSetup, nielsen } from '@wikia/ad-engine';

class NielsenSetup extends BaseServiceSetup {
	initialize() {
		nielsen.call(this.metadata);
		this.setInitialized();
	}
}

export const nielsenSetup = new NielsenSetup();
