import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

export class TagsPlainSumBuilder implements TargetingStrategyInterface {
	constructor(private tagsToSum: TargetingStrategyInterface[]) {}

	execute(): Partial<Targeting> {
		let result = {};

		this.tagsToSum.map((tagSet) => {
			result = { ...result, ...tagSet.execute() };
		});

		return result;
	}
}
