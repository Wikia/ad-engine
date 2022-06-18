import { StrategyBuilder } from '../interfaces/strategy-builder';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { WindowContextDto } from '../interfaces/window-context-dto';

export class PageContextStrategyBuilder implements StrategyBuilder {
	build(skin: string): TargetingStrategy {
		// @ts-ignore because it does not recognize context correctly
		const context: WindowContextDto = window.context;

		return new PageContextStrategy(skin, context);
	}
}
