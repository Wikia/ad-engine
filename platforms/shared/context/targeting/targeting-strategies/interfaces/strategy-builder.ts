import { TargetingStrategy } from './targeting-strategy';

export interface StrategyBuilder {
	build(skin: string): TargetingStrategy;
}
