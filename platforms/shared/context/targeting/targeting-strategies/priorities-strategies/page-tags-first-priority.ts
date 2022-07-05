import { PriorityStrategy } from '../interfaces/priority-strategy';
import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class PageTagsFirstPriority implements PriorityStrategy {
	constructor(private pageTags: Record<string, unknown>) {}

	execute(): TargetingStrategiesNames {
		if (this.doWeHaveAnyPageTags()) {
			return TargetingStrategiesNames.PAGE_CONTEXT;
		}

		return TargetingStrategiesNames.SITE_CONTEXT;
	}

	private doWeHaveAnyPageTags() {
		return this.pageTags instanceof Object && Object.entries(this.pageTags).length > 0;
	}
}
