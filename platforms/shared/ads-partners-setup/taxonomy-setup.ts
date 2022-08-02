import { BaseServiceSetup, taxonomyService } from '@wikia/ad-engine';

class TaxonomySetup extends BaseServiceSetup {
	async initialize() {
		await taxonomyService.configurePageLevelTargeting();
		this.setInitialized();
	}
}

export const taxonomySetup = new TaxonomySetup();
