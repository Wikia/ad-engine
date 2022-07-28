import { BaseServiceSetup, context, utils } from '@wikia/ad-engine';
// eslint-disable-next-line no-restricted-imports
import {
	taxonomyServiceLoader,
	AdTags,
} from '../../../src/ad-services/taxonomy/taxonomy-service.loader';

const logGroup = 'taxonomy-service';

class TaxonomySetup extends BaseServiceSetup {
	private isEnabled(): boolean {
		return context.get('services.taxonomy.enabled');
	}

	private async configurePageLevelTargeting(): Promise<AdTags> {
		if (!this.isEnabled()) {
			return {};
		}

		context.set('targeting.txn', '-1');

		const adTags = await taxonomyServiceLoader.getAdTags();

		utils.logger(logGroup, 'taxonomy ad tags', adTags);

		context.set('targeting.txn', '1');
		Object.keys(adTags).forEach((key) => {
			context.set(`targeting.${key}`, adTags[key]);
		});

		return adTags;
	}

	getName(): string {
		return 'taxonomy-service';
	}

	initialize() {
		this.configurePageLevelTargeting().then(() => {
			this.res();
		});
	}
}

export const taxonomySetup = new TaxonomySetup();
