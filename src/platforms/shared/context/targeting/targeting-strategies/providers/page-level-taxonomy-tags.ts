import { TargetingProvider } from '../interfaces/targeting-provider';
import { FandomContext } from '../models/fandom-context';
import { createTaxonomyTags } from '../factories/create-taxonomy-tags';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export class PageLevelTaxonomyTags implements TargetingProvider<TaxonomyTags> {
	constructor(private fandomContext: FandomContext) {}

	get(): TaxonomyTags {
		const contextTags = this.fandomContext.page.tags;

		return createTaxonomyTags(contextTags);
	}
}
