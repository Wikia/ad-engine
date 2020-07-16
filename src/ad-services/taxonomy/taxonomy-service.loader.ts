import { context, utils } from '@ad-engine/core';

const defaultEndpoint =
	'https://services.fandom.com/knowledge-graph/communities/{communityId}/ad-tags';
const logGroup = 'taxonomy-service-loader';

export interface AdTags {
	[key: string]: string[];
}

export class TaxonomyServiceLoader {
	adTagsPromise: Promise<AdTags> = null;

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
}

export const taxonomyServiceLoader = new TaxonomyServiceLoader();
