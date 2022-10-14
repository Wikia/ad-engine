import { TargetingProvider } from '../interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

export class TagsPlainSumBuilder implements TargetingProvider {
	constructor(private tagsToSum: TargetingProvider[]) {}

	get(): Partial<Targeting> {
		let result = {};

		this.tagsToSum.map((tagSet) => {
			result = { ...result, ...tagSet.get() };
		});

		return result;
	}
}
