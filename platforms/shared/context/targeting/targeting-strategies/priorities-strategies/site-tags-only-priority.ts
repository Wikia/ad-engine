import { PriorityStrategy } from '../interfaces/priority-strategy';
import { SITE_CONTEXT_STRATEGY, TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class SiteTagsOnlyPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return SITE_CONTEXT_STRATEGY;
	}
}
