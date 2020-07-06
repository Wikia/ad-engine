import { context, utils } from '@ad-engine/core';
import { AdTags, taxonomyServiceLoader } from './taxonomy-service.loader';

const logGroup = 'taxonomy-service';

export class TaxonomyService {
	async configurePageLevelTargeting(): Promise<AdTags> {
		if (!this.isEnabled()) {
			return {};
		}

		context.set('targeting.txn', '-1');

		const adTags: AdTags = await taxonomyServiceLoader.getAdTags();

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

	isEnabled(): boolean {
		return context.get('services.taxonomy.enabled');
	}
}

export const taxonomyService = new TaxonomyService();
