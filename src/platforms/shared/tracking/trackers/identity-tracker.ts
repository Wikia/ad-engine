import {
	Apstag,
	communicationService,
	eventsRepository,
	InstantConfigService,
} from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function identityDwTracker(
	dwTracker: DataWarehouseTracker,
	instantConfig: InstantConfigService = null,
): void {
	if (!instantConfig.get('icIdentityPartners', false)) {
		communicationService.on(
			eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
			(eventInfo) => {
				const { partnerName, partnerIdentityId } = eventInfo.payload;
				dwTracker.track(
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
