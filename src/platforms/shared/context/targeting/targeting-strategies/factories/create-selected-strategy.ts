import { createFandomContext } from './create-fandom-context';
import { TargetingProvider, TargetingStrategy } from '../interfaces/targeting-strategy';
import { PageLevelTaxonomyTags } from '../strategies/page-level-taxonomy-tags';
import { SiteLevelTaxonomyTags } from '../strategies/site-level-taxonomy-tags';
import { CommonTags } from '../strategies/common-tags';
import { TagsPlainSumBuilder } from '../structures/tags-plain-sum-builder';
import { PrefixDecorator } from '../structures/prefix-decorator';
import { TagsByKeyComposer } from '../structures/tags-by-key-composer';
import { utils } from '@wikia/ad-engine';

const logGroup = 'Targeting';
const fandomContext = createFandomContext();

export function createSelectedStrategy(selectedStrategy: string, skin: string): TargetingProvider {
	switch (selectedStrategy) {
		case TargetingStrategy.SITE_CONTEXT:
			utils.logger(logGroup, 'Executing SiteContext strategy...');

			return new TagsPlainSumBuilder([
				new CommonTags(skin, fandomContext),
				new SiteLevelTaxonomyTags(fandomContext),
			]);
		case TargetingStrategy.PAGE_CONTEXT:
			utils.logger(logGroup, 'Executing PageContext strategy...');

			return new TagsPlainSumBuilder([
				new CommonTags(skin, fandomContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(fandomContext)),
			]);
		case TargetingStrategy.COMBINED:
		default:
			utils.logger(logGroup, 'Executing Combined strategy...');

			return new TagsPlainSumBuilder([
				new CommonTags(skin, fandomContext),
				new TagsByKeyComposer([
					new SiteLevelTaxonomyTags(fandomContext),
					new PrefixDecorator(new PageLevelTaxonomyTags(fandomContext)),
				]),
			]);
	}
}
