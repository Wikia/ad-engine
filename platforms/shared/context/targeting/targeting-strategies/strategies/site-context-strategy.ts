import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { FandomContext } from '../models/fandom-context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';

export class SiteContextStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing SiteContextStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const siteLevelTags = this.getStrategyLevelTags(this.context.site.tags);
		const siteLevelTaxonomyTags: TaxonomyTags = this.getTaxonomyTags(this.context.site.tags);

		return {
			...siteLevelTags,
			...siteLevelTaxonomyTags,
			...this.getCommonParams(this.context, wiki, this.skin),
		};
	}
}
