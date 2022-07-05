import { TargetingStrategies, TargetingStrategiesNames } from '../../targeting-strategy-executor';
import { LegacySiteContextStrategyBuilder } from '../builders/legacy-site-context-strategy-builder';
import { PageContextStrategyBuilder } from '../builders/page-context-strategy-builder';

export function targetingStrategiesConfigurator(skin: string): TargetingStrategies {
	return {
		[TargetingStrategiesNames.DEFAULT]: new LegacySiteContextStrategyBuilder().build(skin),
		[TargetingStrategiesNames.SITE_CONTEXT]: new LegacySiteContextStrategyBuilder().build(skin),
		[TargetingStrategiesNames.PAGE_CONTEXT]: new PageContextStrategyBuilder().build(skin),
	};
}
