import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import Cookies from 'js-cookie';
import { injectable } from 'tsyringe';
import { getMediaWikiVariable } from '../utils/get-media-wiki-variable';

@injectable()
export class TrackingParametersSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	private getLegacyTrackingParameters(): ITrackingParameters {
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

	private async getNewTrackingParameters(): Promise<ITrackingParameters> {
		await new utils.WaitFor(() => !!window.fandomContext.tracking, 10, 100).until();

		const wikiContext = {
			...window.fandomContext.tracking,
			pvUID: getMediaWikiVariable('pvUID') || window.pvUID,
		};

		return wikiContext;
	}

	private async getTrackingParameters(legacyEnabled: boolean): Promise<ITrackingParameters> {
		return legacyEnabled
			? this.getLegacyTrackingParameters()
			: await this.getNewTrackingParameters();
	}

	async execute() {
		const legacyEnabled = !this.instantConfig.get('icDisableLegacyTrackingParameters', false);
		const trackingParameters = await this.getTrackingParameters(legacyEnabled);

		context.set('wiki', { ...context.get('wiki'), ...trackingParameters });
	}
}
