import { PriorityStrategy } from '../interfaces/priority-strategy';
import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class SiteTagsOnlyPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return TargetingStrategiesNames.SITE_CONTEXT;
	}
}
