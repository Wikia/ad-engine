import { context, DelayModule, utils } from '@ad-engine/core';
import { AdTags, taxonomyServiceLoader } from './taxonomy-service.loader';

const logGroup = 'taxonomy-service';

export class TaxonomyService implements DelayModule {
	private delayPromise: Promise<void> = null;
	private resolveDelayPromise: () => void = null;

	constructor(public taxonomyServiceLoader) {}

	async configurePageLevelTargeting(): Promise<AdTags> {
		if (this.delayPromise === null) {
			this.configureDelayPromise();
		}

		if (!this.isEnabled()) {
			this.resolveDelayPromise();
			return {};
		}

		const adTags: AdTags = await this.taxonomyServiceLoader.getAdTags();

		utils.logger(logGroup, 'taxonomy ad tags', adTags);

		Object.keys(adTags).forEach((key) => {
			context.set(`targeting.${key}`, adTags[key]);
		});

		this.resolveDelayPromise();

		return adTags;
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

	private configureDelayPromise() {
		this.delayPromise = new Promise((resolve) => {
			this.resolveDelayPromise = resolve;
		});
	}
}

export const taxonomyService = new TaxonomyService(taxonomyServiceLoader);
