import { context, Inhibitor, utils } from '@ad-engine/core';
import { AdTags, taxonomyServiceLoader } from './taxonomy-service.loader';

const logGroup = 'taxonomy-service';
const comicsLogGroup = 'taxonomy-comics-service';

export class TaxonomyService extends Inhibitor {
	async configurePageLevelTargeting(): Promise<AdTags> {
		if (!this.isEnabled()) {
			this.markAsReady();

			return {};
		}

		context.set('targeting.txn', '-1');

		const adTags: AdTags = await taxonomyServiceLoader.getAdTags();

		utils.logger(logGroup, 'taxonomy ad tags', adTags);

		context.set('targeting.txn', '1');
		Object.keys(adTags).forEach((key) => {
			context.set(`targeting.${key}`, adTags[key]);
		});

		this.markAsReady();

		return adTags;
	}

	async configureComicsTargeting(): Promise<AdTags> {
		if (!this.isGettingComicsTagEnabled()) {
			this.markAsReady();
			return {};
		}

		const isComicsRelated: string = await taxonomyServiceLoader.getComicsTag();
		const comicsTag: AdTags = { txn_comics: [isComicsRelated] };

		utils.logger(comicsLogGroup, 'taxonomy comics tag', comicsTag);

		context.set('targeting.txn_comics', comicsTag['txn_comics']);

		this.markAsReady();

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
		super.reset();
		taxonomyServiceLoader.resetComicsTagPromise();
		context.remove('targeting.txn_comics');
	}
}

export const taxonomyService = new TaxonomyService();
