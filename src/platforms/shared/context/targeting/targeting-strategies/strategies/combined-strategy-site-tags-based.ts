import { Targeting, utils } from '@wikia/ad-engine';
import { TagsType, TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { CommonStrategy } from './common-strategy';

export class CombinedStrategySiteTagsBased implements TargetingStrategyInterface {
	constructor(private commonStrategy: CommonStrategy) {}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing CombinedStrategySiteTagsBased...');

		const siteLevelTags = this.commonStrategy.getTaxonomyTags(TagsType.SITE);

		const pageLevelTags = this.commonStrategy.getTaxonomyTags(TagsType.PAGE);
		this.commonStrategy.addPagePrefixToValues(pageLevelTags);

		return {
			...siteLevelTags,
			...this.commonStrategy.combinePrefixableTags(siteLevelTags, pageLevelTags),
			...this.commonStrategy.getCommonParams(),
		};
	}
}
