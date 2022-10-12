import { createFandomContext } from './create-fandom-context';
import { TargetingStrategyInterface, TargetingStrategy } from '../interfaces/targeting-strategy';
import { PageLevelTaxonomyTags } from '../strategies/page-level-taxonomy-tags';
import { SiteLevelTaxonomyTags } from '../strategies/site-level-taxonomy-tags';
import { CommonTags } from '../strategies/common-tags';
import { SummaryDecorator } from '../decorators/summary-decorator';
import { PrefixDecorator } from '../decorators/prefix-decorator';
import { CombineTagsDecorator } from '../decorators/combine-tags-decorator';
import { utils } from '@wikia/ad-engine';

const logGroup = 'Targeting';
const fandomContext = createFandomContext();

export function createSelectedStrategy(
	selectedStrategy: string,
	skin: string,
): TargetingStrategyInterface {
	switch (selectedStrategy) {
		case TargetingStrategy.SITE_CONTEXT:
			utils.logger(logGroup, 'Executing SiteContext strategy...');

			return new SummaryDecorator(
				new CommonTags(skin, fandomContext),
				new SiteLevelTaxonomyTags(fandomContext),
			);
		case TargetingStrategy.PAGE_CONTEXT:
			utils.logger(logGroup, 'Executing PageContext strategy...');

			return new SummaryDecorator(
				new CommonTags(skin, fandomContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(fandomContext)),
			);
		case TargetingStrategy.COMBINED:
		default:
			utils.logger(logGroup, 'Executing Combined strategy...');

			return new SummaryDecorator(
				new CommonTags(skin, fandomContext),
				new CombineTagsDecorator([
					new SiteLevelTaxonomyTags(fandomContext),
					new PrefixDecorator(new PageLevelTaxonomyTags(fandomContext)),
				]),
			);
	}
}
