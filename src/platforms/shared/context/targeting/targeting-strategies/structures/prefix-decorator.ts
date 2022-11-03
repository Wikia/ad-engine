import { TargetingProvider } from '../interfaces/targeting-provider';
import { Targeting } from '@wikia/ad-engine';

export class PrefixDecorator implements TargetingProvider {
	private tagsToAddPrefix = ['gnre', 'media', 'pform', 'pub', 'theme', 'tv'];
	constructor(private tagsToDecorate: TargetingProvider) {}

	get(): Partial<Targeting> {
		return this.addPagePrefixToValues(this.tagsToDecorate.get());
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
