import {
	Apstag,
	communicationService,
	eventsRepository,
	InstantConfigService,
	targetingService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { trackingUrls } from '../setup/tracking-urls';
import { DataWarehouseTracker } from './data-warehouse';

@Injectable()
export class TrackingSetup {
	constructor(
		private dwTracker: DataWarehouseTracker,

		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		this.identityTracker();
		this.keyValsTracker();
	}

	private identityTracker(): void {
		if (!this.instantConfig.get('icIdentityPartners', false)) {
			communicationService.on(
				eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
				(eventInfo) => {
					const { partnerName, partnerIdentityId } = eventInfo.payload;
					this.dwTracker.track(
						{
							partner_name: partnerName,
							partner_identity_id: partnerIdentityId,
						},
						trackingUrls.IDENTITY_INFO,
					);

					if (['liveConnect', 'MediaWiki-sha256'].includes(partnerName)) {
						const apstag = Apstag.make();
						apstag.init().then(() => apstag.sendHEM(partnerIdentityId));
					}
				},
				false,
			);
		}
	}

	private keyValsTracker(): void {
		const keyVals = { ...targetingService.dump() };

		// Remove Audigent segments
		delete keyVals.AU_SEG;

		this.dwTracker.track(
			{
				keyvals: JSON.stringify(keyVals),
			},
			trackingUrls.KEY_VALS,
		);
	}
}
