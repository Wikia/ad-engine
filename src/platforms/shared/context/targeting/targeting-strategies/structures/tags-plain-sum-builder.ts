import { TargetingProvider } from '../interfaces/targeting-provider';
import { Targeting } from '@wikia/ad-engine';

export class TagsPlainSumBuilder implements TargetingProvider {
	constructor(private tagsToSum: TargetingProvider[]) {}

	get(): Partial<Targeting> {
		let result = {};

		this.tagsToSum.map((tagSet) => {
			result = { ...result, ...this.sumTags(result, tagSet.get()) };
		});

		return result;
	}

	public sumTags(result, tags) {
		return { ...result, ...tags };
	}
}
