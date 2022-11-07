import { TargetingProvider } from '../interfaces/targeting-provider';
import { Targeting } from '@wikia/ad-engine';

export class TagsByKeyComposer implements TargetingProvider {
	constructor(private tagsToCombine: TargetingProvider[]) {}

	get(): Partial<Targeting> {
		const result = {};

		this.tagsToCombine.forEach((tagSet) => {
			this.combineTags(result, tagSet.get());
		});

		return result;
	}

	private combineTags(result, tags) {
		for (const [key, value] of Object.entries(tags)) {
			if (key in result) {
				if (Array.isArray(value) && value.length > 0) {
					value.forEach((val) => {
						if (!result[key].includes(val)) {
							result[key].push(val);
						}
					});
				}
			} else {
				result[key] = Array.isArray(value) ? Array.from(value) : value;
			}
		}

		return result;
	}
}
