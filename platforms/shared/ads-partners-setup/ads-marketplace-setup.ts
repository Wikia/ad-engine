import { adMarketplace, BaseServiceSetup } from '@wikia/ad-engine';

class AdsMarketplaceSetup extends BaseServiceSetup {
	async initialize() {
		await adMarketplace.initialize();
		this.res();
	}
}

export const adsMarketplaceSetup = new AdsMarketplaceSetup();
