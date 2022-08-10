import { Page, Site } from '../models/context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export function createTaxonomyTags(contextTags: Site['tags'] | Page['tags']): TaxonomyTags {
	return {
		gnre: contextTags?.gnre || [],
		media: contextTags?.media || [],
		pform: contextTags?.pform || [],
		pub: contextTags?.pub || [],
		theme: contextTags?.theme || [],
		tv: contextTags?.tv || [],
	};
}
