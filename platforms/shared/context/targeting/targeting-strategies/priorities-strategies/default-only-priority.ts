import { PriorityStrategy } from '../interfaces/priority-strategy';
import { DEFAULT_STRATEGY, TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class DefaultOnlyPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return DEFAULT_STRATEGY;
	}
}
