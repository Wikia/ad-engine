import {
	DEFAULT_PRIORITY_STRATEGY,
	PriorityStrategies,
} from '../services/targeting-strategy-priority-service';
import { DefaultOnlyPriority } from '../priorities-strategies/default-only-priority';
import { SiteTagsFirstPriority } from '../priorities-strategies/site-tags-first-priority';
import { PageTagsFirstPriority } from '../priorities-strategies/page-tags-first-priority';

export function targetingStrategyPrioritiesBuilder(
	siteTags: Record<string, unknown>,
	pageTags: Record<string, unknown>,
): PriorityStrategies {
	return {
		[DEFAULT_PRIORITY_STRATEGY]: new DefaultOnlyPriority(),
		siteTagsOnly: new DefaultOnlyPriority(),
		siteTagsFirst: new SiteTagsFirstPriority(siteTags),
		pageTagsFirst: new PageTagsFirstPriority(pageTags),
	};
}
