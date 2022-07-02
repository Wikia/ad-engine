import { PriorityStrategy } from '../interfaces/priority-strategy';
import {
	DEFAULT_TARGETING_STRATEGY,
	TargetingStrategiesNames,
} from '../../targeting-strategy-executor';

export class DefaultOnlyPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return DEFAULT_TARGETING_STRATEGY;
	}
}
