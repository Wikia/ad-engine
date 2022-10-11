import { Targeting, utils } from '@wikia/ad-engine';
import { TagsType, TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { CommonStrategy } from './common-strategy';

export class PageContextStrategy implements TargetingStrategyInterface {
	constructor(private commonStrategy: CommonStrategy) {}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing PageContextStrategy...');

		const pageLevelTags = this.commonStrategy.getTaxonomyTags(TagsType.PAGE);
		this.commonStrategy.addPagePrefixToValues(pageLevelTags);

		return {
			...pageLevelTags,
			...this.commonStrategy.getCommonParams(),
		};
	}
}
