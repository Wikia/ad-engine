import { utils } from '@wikia/ad-engine';

import { Context, Page, Site } from '../models/context';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { WindowContextDto } from '../interfaces/window-context-dto';
import { LegacyStrategy } from '../strategies/legacy-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { CombinedStrategy } from '../strategies/combined-strategy';

export enum TargetingStrategiesNames {
	DEFAULT = 'default',
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export function createSelectedStrategy(selectedStrategy: string, skin: string): TargetingStrategy {
	// @ts-ignore because it does not recognize context correctly
	const windowContext: WindowContextDto = window.fandomContext;
	const context = validateWindowContext(windowContext);

	switch (selectedStrategy) {
		case TargetingStrategiesNames.PAGE_CONTEXT:
			return new PageContextStrategy(skin, context);
		case TargetingStrategiesNames.COMBINED:
			return new CombinedStrategy(skin, context);
		case TargetingStrategiesNames.SITE_CONTEXT:
		case TargetingStrategiesNames.DEFAULT:
			return new LegacyStrategy(skin);
		default:
			utils.logger('Targeting', 'Unrecognized strategy, falling back to default');
			return new LegacyStrategy(skin);
	}
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
