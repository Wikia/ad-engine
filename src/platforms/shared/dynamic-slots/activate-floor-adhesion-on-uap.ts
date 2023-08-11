import {
	AdSlotEvent,
	communicationService,
	context,
	eventsRepository,
	UapLoadStatus,
	universalAdPackage,
} from '@wikia/ad-engine';

export function activateFloorAdhesionOnUAP(callback: () => void, withLoadedOnly = true) {
	const firstCallSlotName = 'top_leaderboard';

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
						setTimeout(() => callback(), universalAdPackage.SLIDE_OUT_TIME);
					}
				},
				firstCallSlotName,
			);
		} else if (!withLoadedOnly) {
			if (
				!context.get('state.topLeaderboardExists') ||
				!context.get(`slots.${firstCallSlotName}.defaultTemplates`).includes('stickyTlb')
			) {
				callback();
				return;
			}

			communicationService.onSlotEvent(
				AdSlotEvent.CUSTOM_EVENT,
				({ payload }) => {
					if (payload.status === universalAdPackage.SLOT_STICKINESS_DISABLED) {
						callback();
						return;
					}

					if (
						[
							universalAdPackage.SLOT_UNSTICKED_STATE,
							universalAdPackage.SLOT_FORCE_UNSTICK,
						].includes(payload.status)
					) {
						setTimeout(() => callback(), universalAdPackage.SLIDE_OUT_TIME);
					}
				},
				firstCallSlotName,
			);
		}
	});
}
