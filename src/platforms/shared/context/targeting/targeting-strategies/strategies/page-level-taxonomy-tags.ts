import { Targeting } from '@wikia/ad-engine';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { FandomContext } from '../models/fandom-context';
import { createTaxonomyTags } from '../factories/create-taxonomy-tags';

export class PageLevelTaxonomyTags implements TargetingStrategyInterface {
	constructor(private fandomContext: FandomContext) {}

	execute(): Partial<Targeting> {
		const contextTags = this.fandomContext.page.tags;

		return createTaxonomyTags(contextTags);
	}
}
