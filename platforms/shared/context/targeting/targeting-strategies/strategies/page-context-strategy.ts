import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { FandomContext } from '../models/fandom-context';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';

export class PageContextStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing PageContextStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const pageLevelTags = this.getTaxonomyTags(this.context.page.tags);
		this.addPagePrefixToValues(pageLevelTags);

		return {
			...pageLevelTags,
			...this.getCommonParams(this.context, wiki, this.skin),
		};
	}
}
