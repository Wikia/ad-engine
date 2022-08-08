import { PriorityStrategy } from '../interfaces/priority-strategy';
import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class CombinedTagsPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return TargetingStrategiesNames.COMBINED;
	}
}
