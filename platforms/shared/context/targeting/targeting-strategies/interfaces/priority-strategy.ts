import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export interface PriorityStrategy {
	execute(): TargetingStrategiesNames;
}
