import { TargetingProvider } from '../interfaces/targeting-provider';
import { FandomContext } from '../models/fandom-context';

export class PageLevelTaxonomyTags implements TargetingProvider<TaxonomyTags> {
	constructor(private fandomContext: FandomContext) {}

	get(): TaxonomyTags {
		return this.fandomContext.page.tags;
	}
}
