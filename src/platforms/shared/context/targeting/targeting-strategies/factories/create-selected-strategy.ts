import { createFandomContext } from './create-fandom-context';
import { TargetingStrategyInterface, TargetingStrategy } from '../interfaces/targeting-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { CombinedStrategySiteTagsBased } from '../strategies/combined-strategy-site-tags-based';
import { SiteContextStrategy } from '../strategies/site-context-strategy';
import { CommonStrategy } from '../strategies/common-strategy';

export function createSelectedStrategy(
	selectedStrategy: string,
	skin: string,
): TargetingStrategyInterface {
	switch (selectedStrategy) {
		case TargetingStrategy.SITE_CONTEXT:
			return new SiteContextStrategy(new CommonStrategy(skin, createFandomContext()));
		case TargetingStrategy.PAGE_CONTEXT:
			return new PageContextStrategy(new CommonStrategy(skin, createFandomContext()));
		case TargetingStrategy.COMBINED:
		default:
			return new CombinedStrategySiteTagsBased(new CommonStrategy(skin, createFandomContext()));
	}
}
