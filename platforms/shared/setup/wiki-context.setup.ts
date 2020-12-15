import { context, DiProcess } from '@wikia/ad-engine';

export class WikiContextSetup implements DiProcess {
	execute(): void {
		const wikiContext = {
			beaconId: context.getMediaWikiVariable('beaconId') || window.beaconId || window.beacon_id,
			pvNumber: context.getMediaWikiVariable('pvNumber') || window.pvNumber,
			pvNumberGlobal: context.getMediaWikiVariable('pvNumberGlobal') || window.pvNumberGlobal,
			pvUID: context.getMediaWikiVariable('pvUID') || window.pvUID,
			sessionId: context.getMediaWikiVariable('sessionId') || window.sessionId || window.session_id,

			...(window.mw && window.mw.config ? window.mw.config.values : {}),
			...(window.ads ? window.ads.context : {}),
		};

		context.set('wiki', wikiContext);
	}
}
