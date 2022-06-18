import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { LegacyStrategyBuilder } from './targeting-strategies/builders/legacy-strategy-builder';
import { Targeting } from '@wikia/ad-engine';
import { PageContextStrategyBuilder } from './targeting-strategies/builders/page-context-strategy-builder';

export class TargetingStrategyExecutor {
	public strategyBuilders = {
		default: LegacyStrategyBuilder,
		pageContext: PageContextStrategyBuilder,
	};

	execute(strategyName: string, skin: string): Partial<Targeting> {
		const strategy: TargetingStrategy = new (this.strategyBuilders[strategyName] ||
			this.strategyBuilders.default)().build(skin);

		return strategy.execute();
	}
}
