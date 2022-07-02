import {
	DEFAULT_TARGETING_STRATEGY,
	PAGE_CONTEXT_STRATEGY,
	SITE_CONTEXT_STRATEGY,
	TargetingStrategies,
} from '../../targeting-strategy-executor';
import { LegacySiteContextStrategyBuilder } from '../builders/legacy-site-context-strategy-builder';
import { PageContextStrategyBuilder } from '../builders/page-context-strategy-builder';

export function targetingStrategiesConfigurator(skin: string): TargetingStrategies {
	return {
		[DEFAULT_TARGETING_STRATEGY]: new LegacySiteContextStrategyBuilder().build(skin),
		[SITE_CONTEXT_STRATEGY]: new LegacySiteContextStrategyBuilder().build(skin),
		[PAGE_CONTEXT_STRATEGY]: new PageContextStrategyBuilder().build(skin),
	};
}
