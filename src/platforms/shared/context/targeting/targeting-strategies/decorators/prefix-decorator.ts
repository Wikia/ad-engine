import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

export class PrefixDecorator implements TargetingStrategyInterface {
	private tagsToAddPrefix = ['gnre', 'media', 'pform', 'pub', 'theme', 'tv'];
	constructor(private strategyToDecorate: TargetingStrategyInterface) {}

	execute(): Partial<Targeting> {
		const strategyTags = this.strategyToDecorate.execute();
		return this.addPagePrefixToValues(strategyTags);
	}

	private addPagePrefixToValues(tags) {
		for (const [key, value] of Object.entries(tags)) {
			if (this.tagsToAddPrefix.includes(key) && Array.isArray(value) && value.length > 0) {
				tags[key] = value.map((val) => 'p_' + val);
			}
		}

		return tags;
	}
}
