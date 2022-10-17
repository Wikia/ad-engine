import { TargetingProvider } from '../interfaces/targeting-provider';
import { Targeting } from '@wikia/ad-engine';

export class TagsPlainSumBuilder implements TargetingProvider {
	constructor(private tagsToSum: TargetingProvider[]) {}

	get(): Partial<Targeting> {
		const result = {};

		this.tagsToSum.map((tagSet) => {
			this.sumTags(result, tagSet.get());
		});

		return result;
	}

	public sumTags(result, tags) {
		result = { ...result, ...tags };
		return result;
	}
}
