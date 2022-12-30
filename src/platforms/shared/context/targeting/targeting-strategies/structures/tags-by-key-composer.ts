import { TargetingProvider } from '../interfaces/targeting-provider';

export class TagsByKeyComposer implements TargetingProvider<TaxonomyTags> {
	constructor(private tagsToCombine: TargetingProvider<TaxonomyTags>[]) {}

	get(): TaxonomyTags {
		const result = {};

		this.tagsToCombine.forEach((tagSet) => {
			this.combineTags(result, tagSet.get());
		});

		return result;
	}

	private combineTags(result: TaxonomyTags, tags: TaxonomyTags) {
		if (!tags) {
			return null;
		}

		for (const [key, value] of Object.entries(tags)) {
			if (!this.isRatingTag(key)) {
				if (key in result) {
					value.forEach((val) => {
						if (!result[key].includes(val)) {
							result[key].push(val);
						}
					});
				} else {
					result[key] = Array.from(value);
				}
			}
		}

		return result;
	}

	private isRatingTag(key) {
		const ratingTags = ['esrb', 'mpa'];

		return ratingTags.includes(key);
	}
}
