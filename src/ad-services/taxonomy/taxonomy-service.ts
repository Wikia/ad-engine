import { context, DelayModule, utils } from '@ad-engine/core';
import { AdTags, taxonomyServiceLoader } from './taxonomy-service.loader';

const logGroup = 'taxonomy-service';
const comicsLogGroup = 'taxonomy-comics-service';

export class TaxonomyService implements DelayModule {
	private delayPromise: Promise<void> = null;
	private resolveDelayPromise: () => void = null;

	async configurePageLevelTargeting(): Promise<AdTags> {
		if (this.delayPromise === null) {
			this.configureDelayPromise();
		}

		if (!this.isEnabled()) {
			this.resolveDelayPromise();
			return {};
		}

		context.set('targeting.txn', '-1');

		const adTags: AdTags = await taxonomyServiceLoader.getAdTags();

		utils.logger(logGroup, 'taxonomy ad tags', adTags);

		context.set('targeting.txn', '1');
		Object.keys(adTags).forEach((key) => {
			context.set(`targeting.${key}`, adTags[key]);
		});

		this.resolveDelayPromise();

		return adTags;
	}

	async configureComicsTargeting(): Promise<AdTags> {
		if (this.delayPromise === null) {
			this.configureDelayPromise();
		}

		if (!this.isGettingComicsTagEnabled()) {
			this.resolveDelayPromise();
			return {};
		}

		const isComicsRelated: string = await taxonomyServiceLoader.getComicsTag();
		const comicsTag: AdTags = { txn_comics: [isComicsRelated] };

		utils.logger(comicsLogGroup, 'taxonomy comics tag', comicsTag);

		context.set('targeting.txn_comics', comicsTag['txn_comics']);

		this.resolveDelayPromise();

		return comicsTag;
	}

	getPromise(): Promise<void> {
		if (this.delayPromise === null) {
			this.configureDelayPromise();
		}

		if (!this.isEnabled()) {
			this.resolveDelayPromise();
		}

		return this.delayPromise;
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

	private configureDelayPromise() {
		this.delayPromise = new Promise((resolve) => {
			this.resolveDelayPromise = resolve;
		});
	}
}

export const taxonomyService = new TaxonomyService();
