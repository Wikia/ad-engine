import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { FandomContext } from '../models/fandom-context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';

export class PageContextStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing PageContextStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const pageLevelTags = this.getStrategyLevelTags(this.context.page.tags);
		const pageLevelTaxonomyTags: TaxonomyTags = this.getTaxonomyTags(this.context.page.tags);

		this.addPagePrefixToValues(pageLevelTaxonomyTags);

		return {
			...pageLevelTags,
			...pageLevelTaxonomyTags,
			...this.getCommonParams(this.context, wiki, this.skin),
		};
	}
}
