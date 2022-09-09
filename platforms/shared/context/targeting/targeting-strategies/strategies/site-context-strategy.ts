import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { FandomContext } from '../models/fandom-context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { SpecificStrategyParams } from '../interfaces/specific-strategy-params';

export class SiteContextStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing SiteContextStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const strategySpecificParams: SpecificStrategyParams = {
			age: this.context.site.tags?.age || [],
			sex: this.context.site.tags?.sex || [],
		};

		const siteLevelTags: TaxonomyTags = this.getTaxonomyTags(this.context.site.tags);

		return {
			...strategySpecificParams,
			...siteLevelTags,
			...this.getCommonParams(this.context, wiki, this.skin),
		};
	}
}
