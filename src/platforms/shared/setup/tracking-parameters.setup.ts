import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';
import { getMediaWikiVariable } from '../utils/get-media-wiki-variable';
import { trackingUrls } from './tracking-urls';

@Injectable()
export class TrackingParametersSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	private getPvUniqueId() {
		return (
			getMediaWikiVariable('pvUID') || // UCP
			window.pvUID || // F2
			window.fandomContext.tracking.pvUID // N+R
		);
	}

	private getLegacyTrackingParameters(): ITrackingParameters {
		const cookies = Cookies.get();

		return {
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
			pvUID: this.getPvUniqueId(),
			sessionId:
				getMediaWikiVariable('sessionId') ||
				window.sessionId ||
				window.session_id ||
				cookies['tracking_session_id'],
		};
	}

	private async getNewTrackingParameters(): Promise<Partial<ITrackingParameters>> {
		await new utils.WaitFor(() => !!window.fandomContext?.tracking, 10, 100).until();

		return {
			...window.fandomContext.tracking,
		};
	}

	private async getTrackingParameters(
		legacyEnabled: boolean,
	): Promise<Partial<ITrackingParameters>> {
		return legacyEnabled
			? this.getLegacyTrackingParameters()
			: await this.getNewTrackingParameters();
	}

	async execute() {
		const legacyEnabled = !this.instantConfig.get('icDisableLegacyTrackingParameters', false);
		const trackingParameters = await this.getTrackingParameters(legacyEnabled);

		context.set('wiki', { ...context.get('wiki'), ...trackingParameters });

		Object.values(trackingUrls).forEach((trackingUrlConfig) => {
			const dwTrackServiceLowercase = trackingUrlConfig.name.toLowerCase();
			if (trackingUrlConfig.config.threshold) {
				context.set(
					`services.dw-tracker-${dwTrackServiceLowercase}.threshold`,
					this.instantConfig.get(`icDwTrackerTraffic${trackingUrlConfig.name}Threshold`),
				);
			}

			context.set(
				`services.dw-tracker-${dwTrackServiceLowercase}.aggregate`,
				trackingUrlConfig.config.aggregation
					? this.instantConfig.get(`icDwTrackerTraffic${trackingUrlConfig.name}Aggregate`)
					: false,
			);
		});
	}
}
