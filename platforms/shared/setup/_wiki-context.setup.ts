import { context } from '@wikia/ad-engine';

export class WikiContextSetup {
	configureWikiContext(): void {
		const wikiContext = {
			...(window.mw ? window.mw.config.values : {}),
			...(window.ads ? window.ads.context : {}),
		};

		context.set('wiki', wikiContext);
	}
}
