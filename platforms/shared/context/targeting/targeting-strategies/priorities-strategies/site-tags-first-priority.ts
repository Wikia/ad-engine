import { PriorityStrategy } from '../interfaces/priority-strategy';
import { TargetingStrategiesNames } from '../../targeting-strategy-executor';

export class SiteTagsFirstPriority implements PriorityStrategy {
	constructor(private siteTags: Record<string, unknown>) {}

	execute(): TargetingStrategiesNames {
		if (this.doWeHaveAnySiteTags()) {
			return TargetingStrategiesNames.SITE_CONTEXT;
		}

		return TargetingStrategiesNames.PAGE_CONTEXT;
	}

	private doWeHaveAnySiteTags() {
		return this.siteTags instanceof Object && Object.entries(this.siteTags).length > 0;
	}
}
