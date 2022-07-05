import { PriorityStrategy } from '../interfaces/priority-strategy';
import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export const DEFAULT_PRIORITY_STRATEGY = 'default';

export type PriorityStrategies = {
	[DEFAULT_PRIORITY_STRATEGY]: PriorityStrategy;
	[key: string]: PriorityStrategy;
};

export class TargetingStrategyPriorityService {
	constructor(
		private priorityStrategies: PriorityStrategies,
		private selectedPriorityStrategy: string,
		private logger: (logGroup: string, ...logValues: any[]) => void,
	) {}

	pickQualifyingStrategy(): TargetingStrategiesNames {
		if (this.submittedStrategyWasNotDefined()) {
			const undefinedStrategy: string =
				typeof this.selectedPriorityStrategy === 'string'
					? this.selectedPriorityStrategy
					: 'Selected strategy is not a string';
			this.logger('Targeting', 'Undefined priority strategy was submitted: ' + undefinedStrategy);

			return TargetingStrategiesNames.DEFAULT;
		}

		const strategy =
			this.priorityStrategies[this.selectedPriorityStrategy] || this.priorityStrategies.default;

		return strategy.execute();
	}

	private submittedStrategyWasNotDefined() {
		return !(this.selectedPriorityStrategy in this.priorityStrategies);
	}
}
