import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { WikiContextSetup } from '../../setup/_wiki-context.setup';

@Injectable()
export class UcpWikiContextSetup extends WikiContextSetup {
	execute(): void {
		super.execute();
		// Make sure showAds is set to false in case of any falsy value
		context.set('wiki.opts.showAds', !!context.get('wiki.opts.showAds'));
	}
}
