import { Targeting, utils } from '@wikia/ad-engine';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export function createTaxonomyTags(contextTags: TaxonomyTags): Partial<Targeting> {
	if (!contextTags) {
		utils.warner('Targeting', 'Creating taxonomy tags failed');
	}

	return {
		age: contextTags.age || [],
		bundles: contextTags.bundles || [],
		gnre: contextTags.gnre || [],
		media: contextTags.media || [],
		pform: contextTags.pform || [],
		pub: contextTags.pub || [],
		sex: contextTags.sex || [],
		theme: contextTags.theme || [],
		tv: contextTags.tv || [],
	};
}
