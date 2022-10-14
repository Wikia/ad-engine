import { Targeting } from '@wikia/ad-engine';
import { TargetingProvider } from '../interfaces/targeting-strategy';
import { FandomContext } from '../models/fandom-context';
import { createTaxonomyTags } from '../factories/create-taxonomy-tags';

export class PageLevelTaxonomyTags implements TargetingProvider {
	constructor(private fandomContext: FandomContext) {}

	get(): Partial<Targeting> {
		const contextTags = this.fandomContext.page.tags;

		return createTaxonomyTags(contextTags);
	}
}
