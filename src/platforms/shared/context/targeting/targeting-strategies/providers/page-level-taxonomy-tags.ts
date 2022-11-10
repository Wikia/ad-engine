import { TargetingProvider } from '../interfaces/targeting-provider';
import { FandomContext } from '../models/fandom-context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export class PageLevelTaxonomyTags implements TargetingProvider<TaxonomyTags> {
	constructor(private fandomContext: FandomContext) {}

	get(): TaxonomyTags {
		return this.fandomContext.page.tags;
	}
}
