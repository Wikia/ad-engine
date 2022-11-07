import { utils } from '@wikia/ad-engine';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export function createTaxonomyTags(contextTags: TaxonomyTags): TaxonomyTags {
	if (!contextTags) {
		utils.warner('Targeting', 'Taxonomy tags are not available');
	}

	return {
		age: contextTags?.age || [],
		bundles: contextTags?.bundles || [],
		gnre: contextTags?.gnre || [],
		media: contextTags?.media || [],
		pform: contextTags?.pform || [],
		pub: contextTags?.pub || [],
		sex: contextTags?.sex || [],
		theme: contextTags?.theme || [],
		tv: contextTags?.tv || [],
	};
}
