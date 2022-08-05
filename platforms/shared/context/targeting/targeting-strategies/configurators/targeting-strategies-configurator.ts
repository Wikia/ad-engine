import { TargetingStrategies, TargetingStrategiesNames } from '../../targeting-strategy-executor';
import { WindowContextDto } from '../interfaces/window-context-dto';
import { LegacyStrategy } from '../strategies/legacy-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { CombinedStrategy } from '../strategies/combined-strategy';
import { Context, Page, Site } from '../models/context';

export function targetingStrategiesConfigurator(skin: string): TargetingStrategies {
	// @ts-ignore because it does not recognize context correctly
	const windowContext: WindowContextDto = window.fandomContext;
	const context = validateWindowContext(windowContext);

	return {
		[TargetingStrategiesNames.DEFAULT]: new LegacyStrategy(skin),
		[TargetingStrategiesNames.SITE_CONTEXT]: new LegacyStrategy(skin),
		[TargetingStrategiesNames.PAGE_CONTEXT]: new PageContextStrategy(skin, context),
		[TargetingStrategiesNames.COMBINED]: new CombinedStrategy(skin, context),
	};
}

function validateWindowContext(windowContext: WindowContextDto): Context {
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
