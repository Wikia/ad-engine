import { context, DiProcess } from '@wikia/ad-engine';
import { getMediaWikiVariable } from '../utils/get-media-wiki-variable';

export class WikiContextSetup implements DiProcess {
	execute(): void {
		const wikiContext = {
			beaconId: getMediaWikiVariable('beaconId') || window.beaconId || window.beacon_id,
			pvNumber: getMediaWikiVariable('pvNumber') || window.pvNumber,
			pvNumberGlobal: getMediaWikiVariable('pvNumberGlobal') || window.pvNumberGlobal,
			pvUID: getMediaWikiVariable('pvUID') || window.pvUID,
			sessionId: getMediaWikiVariable('sessionId') || window.sessionId || window.session_id,

			...(window.mw && window.mw.config ? window.mw.config.values : {}),
			...(window.ads ? window.ads.context : {}),
		};

		context.set('wiki', wikiContext);
	}
}
