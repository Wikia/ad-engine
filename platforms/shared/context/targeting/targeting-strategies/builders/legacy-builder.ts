import { StrategyBuilder } from '../interfaces/strategy-builder';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { LegacyStrategy } from '../strategies/legacy-strategy';

export class LegacyBuilder implements StrategyBuilder {
	build(skin: string): TargetingStrategy {
		return new LegacyStrategy(skin);
	}
}
