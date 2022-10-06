import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { FandomContext } from '../models/fandom-context';

export class CombinedStrategySiteTagsBased
	extends CommonStrategy
	implements TargetingStrategyInterface
{
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing CombinedStrategySiteTagsBased...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		// This Combined Strategy is based on Site Level Tags
		const siteLevelTags: TaxonomyTags = this.getTaxonomyTags(this.context.site.tags);

		const pageLevelTags: TaxonomyTags = this.getTaxonomyTags(this.context.page.tags);
		this.addPagePrefixToValues(pageLevelTags);

		return {
			...siteLevelTags,
			...this.combinePrefixableTags(siteLevelTags, pageLevelTags),
			...this.getCommonParams(this.context, wiki, this.skin),
		};
	}
}
