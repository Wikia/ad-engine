import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { FandomContext } from '../models/fandom-context';
import { SpecificStrategyParams } from '../interfaces/specific-strategy-params';

export class CombinedStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing CombinedStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const strategySpecificParams: SpecificStrategyParams = {
			age: this.context.site.tags?.age || [],
			sex: this.context.site.tags?.sex || [],
		};

		const pageLevelTags: TaxonomyTags = this.getTaxonomyTags(this.context.page.tags);
		const siteLevelTags: TaxonomyTags = this.getTaxonomyTags(this.context.site.tags);

		this.addPagePrefixToValues(pageLevelTags);

		return {
			...strategySpecificParams,
			...this.getCommonParams(this.context, wiki, this.skin),
			...this.combineSiteAndPageTags(siteLevelTags, pageLevelTags),
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
