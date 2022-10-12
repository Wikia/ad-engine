import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';
import { CommonTags } from '../strategies/common-tags';

export class SummaryDecorator implements TargetingStrategyInterface {
	constructor(private commonTags: CommonTags, private strategyToSum: TargetingStrategyInterface) {}

	execute(): Partial<Targeting> {
		return {
			...this.commonTags.execute(),
			...this.strategyToSum.execute(),
		};
	}
}
