import { context, utils } from '@ad-engine/core';
import { AdTags, taxonomyServiceLoader } from './taxonomy-service.loader';

const logGroup = 'taxonomy-service';
const comicsLogGroup = 'taxonomy-comics-service';

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

	async configureComicsTargeting(): Promise<AdTags> {
		if (!this.isGettingComicsTagEnabled()) {
			return {};
		}

		const isComicsRelated: string = await taxonomyServiceLoader.getComicsTag();
		const comicsTag: AdTags = { txn_comics: [isComicsRelated] };

		utils.logger(comicsLogGroup, 'taxonomy comics tag', comicsTag);

		context.set('targeting.txn_comics', comicsTag['txn_comics']);

		return comicsTag;
	}

	getName(): string {
		return 'taxonomy-service';
	}

	isEnabled(): boolean {
		return context.get('services.taxonomy.enabled');
	}

	isGettingComicsTagEnabled() {
		return context.get('services.taxonomy.comics.enabled');
	}

	reset(): void {
		taxonomyServiceLoader.resetComicsTagPromise();
		context.remove('targeting.txn_comics');
	}
}

export const taxonomyService = new TaxonomyService();
