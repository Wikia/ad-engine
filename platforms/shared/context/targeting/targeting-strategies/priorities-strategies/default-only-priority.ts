import { PriorityStrategy } from '../interfaces/priority-strategy';
import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class DefaultOnlyPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return TargetingStrategiesNames.DEFAULT;
	}
}
