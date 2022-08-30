import { context, DiProcess } from '@wikia/ad-engine';
import { getMediaWikiVariable } from '../utils/get-media-wiki-variable';
import Cookies from 'js-cookie';

export class TrackingParametersSetup implements DiProcess {
	execute(): void {
		const cookies = Cookies.get();
		const wikiContext = {
			beaconId:
				getMediaWikiVariable('beaconId') ||
				window.beaconId ||
				window.beacon_id ||
				cookies['wikia_beacon_id'],
			pvNumber: getMediaWikiVariable('pvNumber') || window.pvNumber || cookies['pv_number'],
			pvNumberGlobal:
				getMediaWikiVariable('pvNumberGlobal') ||
				window.pvNumberGlobal ||
				cookies['pv_number_global'],
			pvUID: getMediaWikiVariable('pvUID') || window.pvUID,
			sessionId:
				getMediaWikiVariable('sessionId') ||
				window.sessionId ||
				window.session_id ||
				cookies['tracking_session_id'],
		};

		context.set('wiki', Object.assign(wikiContext, context.get('wiki')));
	}
}
