import { BaseServiceSetup, stroer } from '@wikia/ad-engine';

class StroerSetup extends BaseServiceSetup {
	async initialize() {
		await stroer.call();
		this.setInitialized();
	}
}

export const stroerSetup = new StroerSetup();
