import { utils } from '@wikia/ad-engine';
import { TargetingProvider } from '../interfaces/targeting-provider';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { TargetingTags } from '../interfaces/taxonomy-tags';
import { FandomContext } from '../models/fandom-context';
import { CommonTags } from '../providers/common-tags';
import { PageLevelTaxonomyTags } from '../providers/page-level-taxonomy-tags';
import { SiteLevelTaxonomyTags } from '../providers/site-level-taxonomy-tags';
import { PrefixDecorator } from '../structures/prefix-decorator';
import { TagsByKeyComposer } from '../structures/tags-by-key-composer';
import { TagsPlainSumBuilder } from '../structures/tags-plain-sum-builder';

const logGroup = 'Targeting';

export function createSelectedStrategy(
	selectedStrategy: string,
	fandomContext: FandomContext,
	skin: string,
): TargetingProvider<TargetingTags> {
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
