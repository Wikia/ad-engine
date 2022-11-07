import { TargetingProvider } from '../interfaces/targeting-provider';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export class PrefixDecorator implements TargetingProvider<TaxonomyTags> {
	private tagsToAddPrefix = ['gnre', 'media', 'pform', 'pub', 'theme', 'tv'];
	constructor(private tagsToDecorate: TargetingProvider<TaxonomyTags>) {}

	get(): TaxonomyTags {
		return this.addPagePrefixToValues(this.tagsToDecorate.get());
	}

	private addPagePrefixToValues(tags: TaxonomyTags) {
		const result = {};

		for (const [key, value] of Object.entries(tags)) {
			if (this.tagsToAddPrefix.includes(key)) {
				result[key] = [];
				value.forEach((val) => {
					result[key].push('p_' + val);
				});
			} else {
				result[key] = value;
			}
		}

		return result;
	}
}
