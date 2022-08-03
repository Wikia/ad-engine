import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';
import { TargetingStrategyPriorityService } from './targeting-strategies/services/targeting-strategy-priority-service';

export enum TargetingStrategiesNames {
	DEFAULT = 'default',
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export type TargetingStrategies = {
	[key in TargetingStrategiesNames]: TargetingStrategy;
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
