import { TargetingStrategy } from './targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/ad-engine';

type TargetingStrategies = { default: TargetingStrategy; [key: string]: TargetingStrategy };

export class TargetingStrategyExecutor {
	constructor(public readonly strategies: TargetingStrategies) {}

	execute(strategyName: string): Partial<Targeting> {
		const strategy = this.strategies[strategyName] || this.strategies.default;

		return strategy.execute();
	}
}
