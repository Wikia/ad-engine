import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';
import { TargetingStrategyPriorityService } from './targeting-strategies/services/targeting-strategy-priority-service';

// TODO Refactor this in to Enum
export type TargetingStrategiesNames = 'default' | 'siteContext' | 'pageContext';
export const DEFAULT_TARGETING_STRATEGY = 'default';
export const SITE_CONTEXT_STRATEGY = 'siteContext';
export const PAGE_CONTEXT_STRATEGY = 'pageContext';

export type TargetingStrategies = {
	[DEFAULT_TARGETING_STRATEGY]: TargetingStrategy;
	[SITE_CONTEXT_STRATEGY]: TargetingStrategy;
	[PAGE_CONTEXT_STRATEGY]: TargetingStrategy;
};

export class TargetingStrategyExecutor {
	constructor(
		private strategies: TargetingStrategies,
		private priorityService: TargetingStrategyPriorityService,
		private strategyListener: (usedStrategy: TargetingStrategiesNames) => void,
	) {}

	execute(): Partial<Targeting> {
		const strategyName = this.priorityService.pickQualifyingStrategy();
		this.strategyListener(strategyName);
		return this.strategies[strategyName].execute();
	}
}
