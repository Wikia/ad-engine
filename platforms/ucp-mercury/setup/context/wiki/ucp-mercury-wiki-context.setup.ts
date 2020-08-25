import { WikiContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

export const MEDIA_WIKI_ADS_CONTEXT = Symbol('MediaWikiAdsContext');

@Injectable({ scope: 'Transient' })
export class UcpMercuryWikiContextSetup extends WikiContextSetup {
	constructor(@Inject(MEDIA_WIKI_ADS_CONTEXT) private adsContext: MediaWikiAdsContext) {
		super();
	}

	execute(): void {
		super.execute();

		context.set('wiki', {
			...context.get('wiki'),
			...this.adsContext,
		});
		// Make sure showAds is set to false in case of any falsy value
		context.set('wiki.opts.showAds', !!context.get('wiki.opts.showAds'));
	}
}
