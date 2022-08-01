import { BaseServiceSetup, stroer } from '@wikia/ad-engine';

class StroerSetup extends BaseServiceSetup {
	async initialize() {
		await stroer.call();
		this.res();
	}
}

export const stroerSetup = new StroerSetup();
