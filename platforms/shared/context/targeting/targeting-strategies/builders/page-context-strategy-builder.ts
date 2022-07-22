import { StrategyBuilder } from '../interfaces/strategy-builder';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { WindowContextDto } from '../interfaces/window-context-dto';
import { Context, Page, Site } from '../models/context';

export class PageContextStrategyBuilder implements StrategyBuilder {
	build(skin: string): TargetingStrategy {
		// @ts-ignore because it does not recognize context correctly
		const windowContext: WindowContextDto = window.fandomContext;

		const context = this.validateWindowContext(windowContext);

		return new PageContextStrategy(skin, context);
	}

	private validateWindowContext(windowContext: WindowContextDto): Context {
		return new Context(
			new Site(
				windowContext?.site?.categories,
				windowContext?.site?.directedAtChildren,
				windowContext?.site?.esrbRating,
				windowContext?.site?.siteName,
				windowContext?.site?.top1000,
				windowContext?.site?.tags,
				windowContext?.site?.vertical,
			),
			new Page(
				windowContext?.page?.articleId,
				windowContext?.page?.lang,
				windowContext?.page?.pageId,
				windowContext?.page?.pageName,
				windowContext?.page?.pageType,
				windowContext?.page?.tags,
			),
		);
	}
}
