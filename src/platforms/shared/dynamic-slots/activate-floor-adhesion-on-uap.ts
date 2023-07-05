import {
	AdSlotEvent,
	communicationService,
	eventsRepository,
	UapLoadStatus,
	universalAdPackage,
} from '@wikia/ad-engine';
import { StickyTlbAllowanceExaminer } from '../templates/handlers/sticky-tlb/sticky-tlb-allowance-examiner';

export function activateFloorAdhesionOnUAP(callback: () => void, withLoadedOnly = true) {
	communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
		if (action.isLoaded) {
			communicationService.onSlotEvent(
				AdSlotEvent.CUSTOM_EVENT,
				({ slot, payload }) => {
					const stickyExaminer = new StickyTlbAllowanceExaminer(slot);

					if (
						stickyExaminer.shouldStick() &&
						[
							universalAdPackage.SLOT_UNSTICKED_STATE,
							universalAdPackage.SLOT_FORCE_UNSTICK,
							universalAdPackage.SLOT_STICKY_STATE_SKIPPED,
							universalAdPackage.SLOT_VIDEO_DONE,
						].includes(payload.status)
					) {
						const timeoutCallbackActivation =
							universalAdPackage.SLIDE_OUT_TIME +
							universalAdPackage.DELAY_TIME_FOR_SLIDE_OUT_FINISH;
						setTimeout(() => callback(), timeoutCallbackActivation);
					}
				},
				'top_leaderboard',
			);
		} else if (!withLoadedOnly) {
			callback();
		}
	});
}
