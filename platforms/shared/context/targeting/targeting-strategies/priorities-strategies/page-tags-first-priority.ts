import { PriorityStrategy } from '../interfaces/priority-strategy';
import {
	PAGE_CONTEXT_STRATEGY,
	SITE_CONTEXT_STRATEGY,
	TargetingStrategiesNames,
} from '../../targeting-strategy-executor';

export class PageTagsFirstPriority implements PriorityStrategy {
	constructor(private pageTags: Record<string, unknown>) {}

	execute(): TargetingStrategiesNames {
		if (this.doWeHaveAnyPageTags()) {
			return PAGE_CONTEXT_STRATEGY;
		}

		return SITE_CONTEXT_STRATEGY;
	}

	private doWeHaveAnyPageTags() {
		return this.pageTags instanceof Object && Object.entries(this.pageTags).length > 0;
	}
}
