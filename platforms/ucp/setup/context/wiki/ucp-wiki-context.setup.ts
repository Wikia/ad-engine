import { WikiContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpWikiContextSetup implements WikiContextSetup {
	configureWikiContext(): void {
		const wikiContext = window.ads ? window.ads.context : {};

		context.set('wiki', wikiContext);
		// Make sure showAds is set to false in case of any falsy value
		context.set('wiki.opts.showAds', !!context.get('wiki.opts.showAds'));
	}
}
