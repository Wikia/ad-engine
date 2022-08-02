import { BaseServiceSetup, bidders } from '@wikia/ad-engine';

class BiddersSetup extends BaseServiceSetup {
	async initialize() {
		await bidders.requestBids();
		this.setInitialized();
	}
}

export const biddersSetup = new BiddersSetup();
