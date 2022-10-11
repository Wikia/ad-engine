import { Targeting, utils } from '@wikia/ad-engine';
import { TagsType, TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { CommonStrategy } from './common-strategy';

export class SiteContextStrategy implements TargetingStrategyInterface {
	constructor(private commonStrategy: CommonStrategy) {}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing SiteContextStrategy...');

		const siteLevelTags = this.commonStrategy.getTaxonomyTags(TagsType.SITE);

		return {
			...siteLevelTags,
			...this.commonStrategy.getCommonParams(),
		};
	}
}
