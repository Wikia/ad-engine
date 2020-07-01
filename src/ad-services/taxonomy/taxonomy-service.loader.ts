import { context, utils } from '@ad-engine/core';

const defaultEndpoint =
	'https://services.fandom.com/knowledge-graph/communities/{communityId}/ad-tags';
const logGroup = 'taxonomy-service-loader';
const comicsLogGroup = 'taxonomy-comics-service-loader';

export interface AdTags {
	[key: string]: string[];
}

export class TaxonomyServiceLoader {
	adTagsPromise: Promise<AdTags> = null;
	comicsTagPromise: Promise<string> = null;

	resetComicsTagPromise() {
		this.comicsTagPromise = null;
	}

	async getAdTags(): Promise<AdTags> {
		if (!this.adTagsPromise) {
			this.adTagsPromise = this.fetchAdTags();
		}

		return this.adTagsPromise;
	}

	private async fetchAdTags(): Promise<AdTags> {
		const endpoint = context.get('services.taxonomy.endpoint') || defaultEndpoint;
		const communityId =
			context.get('services.taxonomy.communityId') || window.ads.context.targeting.wikiId;
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
					utils.logger(logGroup, `response status: ${response.status}`);

					return {};
				},
				() => {
					utils.logger(logGroup, 'rejected');

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
						utils.logger(comicsLogGroup, 'successful response');

						return response.json();
					}
					utils.logger(comicsLogGroup, `response status: ${response.status}`);

					return {};
				},
				() => {
					utils.logger(comicsLogGroup, 'rejected');

					return {};
				},
			)
			.then((comicsTag: string) => {
				utils.logger(comicsLogGroup, 'Comics tag fetched', comicsTag);

				return comicsTag;
			});
	}
}

export const taxonomyServiceLoader = new TaxonomyServiceLoader();
