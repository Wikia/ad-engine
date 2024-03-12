import {
	BaseTrackingSetup,
	communicationService,
	eventsRepository,
	trackingUrls,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpNoAdsTrackingSetup extends BaseTrackingSetup {
	constructor(protected labradorTracker, protected dwTracker, protected instantConfig) {
		super(labradorTracker, dwTracker, instantConfig);
	}

	execute(): void {
		this.identityTracker();
		super.execute();
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
				},
				false,
			);
		}
	}
}
