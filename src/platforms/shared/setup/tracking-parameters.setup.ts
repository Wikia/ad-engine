import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';
import { getMediaWikiVariable } from '../utils/get-media-wiki-variable';

function getLegacyTrackingParameters(): ITrackingParameters {
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

	return wikiContext;
}

async function getNewTrackingParameters(): Promise<ITrackingParameters> {
	await new utils.WaitFor(() => !!window.fandomContext.tracking, 10, 100).until();

	const wikiContext = {
		...window.fandomContext.tracking,
		pvUID: getMediaWikiVariable('pvUID') || window.pvUID,
	};

	return wikiContext;
}

async function getTrackingParameters(legacyEnabled: boolean): Promise<ITrackingParameters> {
	return legacyEnabled ? getLegacyTrackingParameters() : await getNewTrackingParameters();
}

@Injectable()
export class TrackingParametersSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		const legacyEnabled = !this.instantConfig.get('icDisableLegacyTrackingParameters', false);
		const trackingParameters = await getTrackingParameters(legacyEnabled);

		context.set('wiki', Object.assign(trackingParameters, context.get('wiki')));
	}
}
