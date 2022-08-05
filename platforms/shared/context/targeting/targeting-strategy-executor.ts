import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { Targeting, utils } from '@wikia/ad-engine';

export enum TargetingStrategiesNames {
	DEFAULT = 'default',
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export type TargetingStrategies = {
	[key in TargetingStrategiesNames]: TargetingStrategy;
};

export class TargetingStrategyExecutor {
	constructor(private strategies: TargetingStrategies, private selectedStrategy: string) {}

	execute(): Partial<Targeting> {
		if (this.strategies[this.selectedStrategy]) {
			return this.strategies[this.selectedStrategy].execute();
		}

		utils.logger('Targeting', 'Unrecognized strategy, falling back to default');
		return this.strategies[TargetingStrategiesNames.DEFAULT].execute();
	}
}
