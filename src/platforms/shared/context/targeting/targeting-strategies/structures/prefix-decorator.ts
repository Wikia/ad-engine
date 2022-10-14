import { TargetingProvider } from '../interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

export class PrefixDecorator implements TargetingProvider {
	private tagsToAddPrefix = ['gnre', 'media', 'pform', 'pub', 'theme', 'tv'];
	constructor(private strategyToDecorate: TargetingProvider) {}

	get(): Partial<Targeting> {
		const strategyTags = this.strategyToDecorate.get();
		return this.addPagePrefixToValues(strategyTags);
	}

	public addPagePrefixToValues(tags) {
		for (const [key, value] of Object.entries(tags)) {
			if (this.tagsToAddPrefix.includes(key) && Array.isArray(value) && value.length > 0) {
				tags[key] = value.map((val) => 'p_' + val);
			}
		}

		return tags;
	}
}
