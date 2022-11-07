import { TargetingProvider } from '../interfaces/targeting-provider';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export class PrefixDecorator implements TargetingProvider<TaxonomyTags> {
	private tagsToAddPrefix = ['gnre', 'media', 'pform', 'pub', 'theme', 'tv'];
	constructor(private tagsToDecorate: TargetingProvider<TaxonomyTags>) {}

	get(): TaxonomyTags {
		return this.addPagePrefixToValues(this.tagsToDecorate.get());
	}

	public addPagePrefixToValues(tags: TaxonomyTags) {
		for (const [key, value] of Object.entries(tags)) {
			if (this.tagsToAddPrefix.includes(key)) {
				tags[key] = [];
				value.forEach((val) => {
					tags[key].push('p_' + val);
				});
			}
		}

		return tags;
	}
}
