import { PriorityStrategy } from '../interfaces/priority-strategy';
import { DEFAULT_STRATEGY } from '../../targeting-strategy-executor';

export const DEFAULT_PRIORITY_STRATEGY = 'default';

export type PriorityStrategies = {
	[DEFAULT_PRIORITY_STRATEGY]: PriorityStrategy;
	[key: string]: PriorityStrategy;
};

export class TargetingStrategyPriorityService {
	constructor(
		private priorityStrategies: PriorityStrategies,
		private logger: (logGroup: string, ...logValues: any[]) => void,
	) {}

	pickQualifyingStrategy(selectedPriorityStrategy: string): string {
		if (!(selectedPriorityStrategy in this.priorityStrategies)) {
			const undefinedStrategy: string =
				typeof selectedPriorityStrategy === 'string'
					? selectedPriorityStrategy
					: 'Selected strategy is not a string';
			this.logger('Targeting', 'Undefined priority strategy was selected: ' + undefinedStrategy);

			return DEFAULT_STRATEGY;
		}

		const strategy =
			this.priorityStrategies[selectedPriorityStrategy] || this.priorityStrategies.default;

		return strategy.execute();
	}
}
