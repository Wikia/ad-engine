import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { FandomContext } from '../models/fandom-context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { SpecificStrategyParams } from '../interfaces/specific-strategy-params';

export class PageContextStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing PageContextStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const strategySpecificParams: SpecificStrategyParams = {
			age: this.context.page.tags?.age || [],
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
