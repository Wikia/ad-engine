import { context, DiProcess } from '@wikia/ad-engine';

export class PlatformContextSetup implements DiProcess {
	execute(): void {
		const wikiContext = {
			...(window.mw && window.mw.config ? window.mw.config.values : {}),
			...(window.ads ? window.ads.context : {}),
		};

		context.set('wiki', Object.assign(wikiContext, context.get('wiki')));
	}
}
