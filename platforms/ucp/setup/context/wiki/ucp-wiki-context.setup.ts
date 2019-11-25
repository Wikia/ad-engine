import { WikiContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpWikiContextSetup implements WikiContextSetup {
	configureWikiContext(): void {
		const wikiContext = window.ads ? window.ads.context : {};

		context.set('wiki', wikiContext);
	}
}
