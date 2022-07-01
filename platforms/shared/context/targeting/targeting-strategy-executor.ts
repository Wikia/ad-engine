import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

// TODO Refactor this in to Enum
export type TargetingStrategiesNames = 'default' | 'siteContext' | 'pageContext';
export const DEFAULT_STRATEGY = 'default';
export const SITE_CONTEXT_STRATEGY = 'siteContext';
export const PAGE_CONTEXT_STRATEGY = 'pageContext';

export type TargetingStrategies = {
	[DEFAULT_STRATEGY]: TargetingStrategy;
	[SITE_CONTEXT_STRATEGY]: TargetingStrategy;
	[PAGE_CONTEXT_STRATEGY]: TargetingStrategy;
};

export class TargetingStrategyExecutor {
	constructor(
		private strategies: TargetingStrategies,
		private siteTags: Record<string, unknown>,
		private logger: (logGroup: string, ...logValues: any[]) => void,
	) {}

	execute(selectedStrategy: string): Partial<Targeting> {
		const strategy = this.strategies[this.pickStrategy(selectedStrategy)];

		return strategy.execute();
	}

	pickStrategy(selectedStrategy: string): string {
		if (selectedStrategy === DEFAULT_STRATEGY) {
			return DEFAULT_STRATEGY;
		}

		if (!(selectedStrategy in this.strategies)) {
			const undefinedStrategy: string =
				typeof selectedStrategy === 'string'
					? selectedStrategy
					: 'Selected strategy is not a string';
			this.logger('Targeting', 'Undefined strategy was selected: ' + undefinedStrategy);

			return DEFAULT_STRATEGY;
		}

		if (this.siteTags instanceof Object && Object.entries(this.siteTags).length > 0) {
			return DEFAULT_STRATEGY;
		}

		return selectedStrategy;
	}
}
