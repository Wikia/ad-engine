import { context, DelayModule, utils } from '@ad-engine/core';
import { AdTags, taxonomyServiceLoader } from './taxonomy-service.loader';

const logGroup = 'taxonomy-service';

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

	async configureComixologyTargeting(): Promise<AdTags> {
		if (this.delayPromise === null) {
			this.configureDelayPromise();
		}

		if (!this.isGettingComixologyTagEnabled()) {
			this.resolveDelayPromise();
			return {};
		}

		const isComicsRelated: string = await taxonomyServiceLoader.getComixologyTag();
		const comixologyTag: AdTags = { txn_comics: [isComicsRelated] };

		utils.logger(logGroup, 'taxonomy comixology tag', comixologyTag);

		context.set('targeting.txn_comics', comixologyTag['txn_comics']);

		this.resolveDelayPromise();

		return comixologyTag;
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

	isGettingComixologyTagEnabled() {
		return context.get('services.taxonomy.comixology.enabled');
	}

	private configureDelayPromise() {
		this.delayPromise = new Promise((resolve) => {
			this.resolveDelayPromise = resolve;
		});
	}
}

export const taxonomyService = new TaxonomyService();
