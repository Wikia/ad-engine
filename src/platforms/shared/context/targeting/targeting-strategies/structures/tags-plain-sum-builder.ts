import { TargetingProvider } from '../interfaces/targeting-provider';
import { TargetingTags } from '../interfaces/taxonomy-tags';

export class TagsPlainSumBuilder implements TargetingProvider<TargetingTags> {
	constructor(private tagsToSum: TargetingProvider<TargetingTags>[]) {}

	get(): TargetingTags {
		let result = {};

		this.tagsToSum.map((tagSet) => {
			result = Object.assign(result, tagSet.get());
		});

		return result;
	}
}
