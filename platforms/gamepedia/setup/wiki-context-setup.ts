import { WikiContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaWikiContextSetup implements WikiContextSetup {
	configureWikiContext(): void {
		const wikiContext = window.mw ? window.mw.config.values : {};

		context.set('wiki', wikiContext);
	}
}
