import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

export const DEFAULT_STRATEGY = 'default';

export type TargetingStrategies = {
	[DEFAULT_STRATEGY]: TargetingStrategy;
	[key: string]: TargetingStrategy;
};

export class TargetingStrategyExecutor {
	constructor(
		private strategies: TargetingStrategies,
		private siteTags: Record<string, unknown>,
		private logger: (logGroup: string, ...logValues: any[]) => void,
	) {}

	execute(selectedStrategy: string): Partial<Targeting> {
		const strategy =
			this.strategies[this.pickStrategy(selectedStrategy)] || this.strategies.default;

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
