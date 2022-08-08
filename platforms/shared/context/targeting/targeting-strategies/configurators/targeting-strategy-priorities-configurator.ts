import {
	DEFAULT_PRIORITY_STRATEGY,
	PriorityStrategies,
} from '../services/targeting-strategy-priority-service';
import { DefaultOnlyPriority } from '../priorities-strategies/default-only-priority';
import { SiteTagsOnlyPriority } from '../priorities-strategies/site-tags-only-priority';
import { SiteTagsFirstPriority } from '../priorities-strategies/site-tags-first-priority';
import { PageTagsFirstPriority } from '../priorities-strategies/page-tags-first-priority';
import { CombinedTagsPriority } from '../priorities-strategies/combined-tags-priority';

export function targetingStrategyPrioritiesConfigurator(): PriorityStrategies {
	// @ts-ignore because it does not recognize context correctly
	const siteTags = window.fandomContext?.site?.tags;
	// @ts-ignore because it does not recognize context correctly
	const pageTags = window.fandomContext?.page?.tags;

	return {
		[DEFAULT_PRIORITY_STRATEGY]: new DefaultOnlyPriority(),
		siteTagsOnly: new SiteTagsOnlyPriority(),
		siteTagsFirst: new SiteTagsFirstPriority(siteTags),
		pageTagsFirst: new PageTagsFirstPriority(pageTags),
		combined: new CombinedTagsPriority(),
	};
}
