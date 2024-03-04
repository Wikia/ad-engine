import {
	AdSlotEvent,
	communicationService,
	context,
	eventsRepository,
	uapConsts,
	UapLoadStatus,
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
							uapConsts.SLOT_UNSTICKED_STATE,
							uapConsts.SLOT_FORCE_UNSTICK,
							uapConsts.SLOT_STICKY_STATE_SKIPPED,
							uapConsts.SLOT_VIDEO_DONE,
						].includes(payload.status)
					) {
						setTimeout(() => callback(), uapConsts.SLIDE_OUT_TIME);
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
					if (payload.status === uapConsts.SLOT_STICKINESS_DISABLED) {
						callback();
						return;
					}

					if (
						[uapConsts.SLOT_UNSTICKED_STATE, uapConsts.SLOT_FORCE_UNSTICK].includes(payload.status)
					) {
						setTimeout(() => callback(), uapConsts.SLIDE_OUT_TIME);
					}
				},
				firstCallSlotName,
			);
		}
	});
}
