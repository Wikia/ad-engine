import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { LegacyBuilder } from './targeting-strategies/builders/legacy-builder';
import { Targeting } from '@wikia/ad-engine';

export type StrategyBuildersSet = { [index: string]: typeof LegacyBuilder };

export class TargetingStrategyExecutor {
	public strategyBuilders: StrategyBuildersSet = {
		default: LegacyBuilder,
	};

	execute(strategyName: string, skin: string): Partial<Targeting> {
		const strategy: TargetingStrategy = new (this.strategyBuilders[strategyName] ||
			this.strategyBuilders.default)().build(skin);

		return strategy.execute();
	}
}
