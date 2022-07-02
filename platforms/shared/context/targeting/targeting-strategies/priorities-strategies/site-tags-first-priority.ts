import { PriorityStrategy } from '../interfaces/priority-strategy';
import {
	PAGE_CONTEXT_STRATEGY,
	SITE_CONTEXT_STRATEGY,
	TargetingStrategiesNames,
} from '../../targeting-strategy-executor';

export class SiteTagsFirstPriority implements PriorityStrategy {
	constructor(private siteTags: Record<string, unknown>) {}

	execute(): TargetingStrategiesNames {
		if (this.doWeHaveAnySiteTags()) {
			return SITE_CONTEXT_STRATEGY;
		}

		return PAGE_CONTEXT_STRATEGY;
	}

	private doWeHaveAnySiteTags() {
		return this.siteTags instanceof Object && Object.entries(this.siteTags).length > 0;
	}
}
