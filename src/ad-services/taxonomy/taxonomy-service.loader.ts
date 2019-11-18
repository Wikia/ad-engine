import { context, utils } from '@ad-engine/core';

const defaultEndpoint =
	'https://services.fandom.com/knowledge-graph/communities/{communityId}/ad-tags';
const logGroup = 'taxonomy-service-loader';

export interface AdTags {
	[key: string]: string[];
}

export class TaxonomyServiceLoader {
	adTagsPromise: Promise<AdTags> = null;
	comicsTagPromise: Promise<string> = null;

	async getAdTags(): Promise<AdTags> {
		if (!this.adTagsPromise) {
			this.adTagsPromise = this.fetchAdTags();
		}

		return this.adTagsPromise;
	}

	private async fetchAdTags(): Promise<AdTags> {
		const endpoint = context.get('services.taxonomy.endpoint') || defaultEndpoint;
		const communityId = context.get('services.taxonomy.communityId');
		const url = utils.stringBuilder.build(endpoint, {
			communityId,
		});

		return fetch(url)
			.then(
				(response: Response) => {
					if (response.status === 200) {
						utils.logger(logGroup, 'successful response');

						return response.json();
					}

					return {};
				},
				() => {
					return {};
				},
			)
			.then((adTags: AdTags) => {
				utils.logger(logGroup, 'ad tags fetched', adTags);

				return adTags;
			});
	}

	async getComicsTag(): Promise<string> {
		if (!this.comicsTagPromise) {
			this.comicsTagPromise = this.fetchComicsTag();
		}

		return this.comicsTagPromise;
	}

	private async fetchComicsTag(): Promise<string> {
		const endpoint =
			'https://services.fandom.com/knowledge-graph/community/{communityId}/{pageArticleId}/comixology';
		const communityId = context.get('services.taxonomy.communityId');
		const pageArticleId = context.get('services.taxonomy.pageArticleId');

		const url = utils.stringBuilder.build(endpoint, {
			communityId,
			pageArticleId,
		});

		return fetch(url)
			.then(
				(response: Response) => {
					if (response.status === 200) {
						utils.logger(logGroup, 'successful response');

						return response.json();
					}

					return {};
				},
				() => {
					return {};
				},
			)
			.then((comicsTag: string) => {
				utils.logger(logGroup, 'comics tag fetched', comicsTag);

				return comicsTag;
			});
	}
}

export const taxonomyServiceLoader = new TaxonomyServiceLoader();
