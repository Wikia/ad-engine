// @ts-strict-ignore
import { FandomContext, Page, Site } from '../models/fandom-context';

export function createFandomContext() {
	const windowContext: WindowFandomContext = window.fandomContext;

	return buildFandomContext(windowContext);
}

function buildFandomContext(windowContext: WindowFandomContext): FandomContext {
	return new FandomContext(
		new Site(
			windowContext?.site?.categories,
			windowContext?.site?.directedAtChildren,
			windowContext?.site?.siteName,
			windowContext?.site?.top1000,
			windowContext?.site?.tags,
			windowContext?.site?.taxonomy,
		),
		new Page(
			windowContext?.page?.articleId,
			windowContext?.page?.lang,
			windowContext?.page?.pageId,
			windowContext?.page?.pageName,
			windowContext?.page?.pageType,
			windowContext?.page?.tags,
			windowContext?.page?.wordCount,
		),
	);
}
