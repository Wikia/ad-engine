import {
	AdSlotEvent,
	communicationService,
	eventsRepository,
	UapLoadStatus,
	universalAdPackage,
} from '@wikia/ad-engine';

export function activateFloorAdhesionOnUAP(callback: () => void) {
	communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
		if (action.isLoaded) {
			communicationService.onSlotEvent(
				AdSlotEvent.CUSTOM_EVENT,
				({ payload }) => {
					if (
						[
							universalAdPackage.SLOT_UNSTICKED_STATE,
							universalAdPackage.SLOT_FORCE_UNSTICK,
							universalAdPackage.SLOT_STICKY_STATE_SKIPPED,
							universalAdPackage.SLOT_VIDEO_DONE,
						].includes(payload.status)
					) {
						callback();
					}
				},
				'top_leaderboard',
			);
		}
	});
}
