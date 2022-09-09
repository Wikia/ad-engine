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

		const strategySpecificParams = {
			age: this.context.page.tags?.age || [],
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			lang: this.context.page.lang || 'unknown',
			sex: this.context.page.tags?.sex || [],
		};

		const pageLevelTags: TaxonomyTags = this.getTaxonomyTags(this.context.page.tags);

		this.addPagePrefixToValues(pageLevelTags);

		return {
			...strategySpecificParams,
			...pageLevelTags,
			...this.getCommonParams(this.context, wiki, this.skin),
		};
	}
}
