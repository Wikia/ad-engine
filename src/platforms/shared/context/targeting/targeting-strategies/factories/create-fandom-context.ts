import { FandomContext, Page, Site } from '../models/fandom-context';

export function createFandomContext() {
	const windowContext: WindowFandomContext = JSON.parse(JSON.stringify(window.fandomContext));
	return validateFandomContext(windowContext);
}

function validateFandomContext(windowContext: WindowFandomContext): FandomContext {
	return new FandomContext(
		new Site(
			windowContext?.site?.categories,
			windowContext?.site?.directedAtChildren,
			windowContext?.site?.esrbRating,
			windowContext?.site?.siteName,
			windowContext?.site?.top1000,
			windowContext?.site?.tags,
			windowContext?.site?.taxonomy,
			// 'vertical' should be removed after UCP release from ADEN-12194
			windowContext?.site?.vertical,
			windowContext?.site?.mpaRating,
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
