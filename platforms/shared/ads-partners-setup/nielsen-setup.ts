import { BaseServiceSetup, nielsen } from '@wikia/ad-engine';

class NielsenSetup extends BaseServiceSetup {
	initialize() {
		nielsen.call(this.metadata);
		this.res();
	}
}

export const nielsenSetup = new NielsenSetup();
