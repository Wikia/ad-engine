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
		const siteLevelTags = this.getStrategyLevelTags(this.context.site.tags);

		const siteLevelTaxonomyTags: TaxonomyTags = this.getTaxonomyTags(this.context.site.tags);
		const pageLevelTaxonomyTags: TaxonomyTags = this.getTaxonomyTags(this.context.page.tags);

		this.addPagePrefixToValues(pageLevelTaxonomyTags);

		return {
			...siteLevelTags,
			...this.getCommonParams(this.context, wiki, this.skin),
			...this.combineSiteAndPageTags(siteLevelTaxonomyTags, pageLevelTaxonomyTags),
		};
	}

	combineSiteAndPageTags(siteTags: TaxonomyTags, pageTags: TaxonomyTags): TaxonomyTags {
		const combinedTags: TaxonomyTags = {};

		for (const [key, value] of Object.entries(siteTags)) {
			if (Array.isArray(value) && value.length > 0) {
				combinedTags[key] = siteTags[key].concat(pageTags[key]);
			} else if (Array.isArray(value) && value.length === 0) {
				combinedTags[key] = pageTags[key];
			}
		}

		return combinedTags;
	}
}
