import { communicationService, eventsRepository, porvataTracker } from '@wikia/ad-engine';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

export function porvataDwTracker(dwTracker: DataWarehouseTracker): void {
	communicationService.on(
		eventsRepository.VIDEO_PLAYER_TRACKING,
		({ eventInfo }) => {
			dwTracker.track(eventInfo, trackingUrls.AD_ENG_PLAYER_INFO);
		},
		false,
	);

	porvataTracker.register();
}
