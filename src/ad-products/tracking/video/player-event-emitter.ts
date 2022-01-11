import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, VideoEventData } from '@ad-engine/core';

export default {
	/**
	 * Emit single event
	 */
	emit(eventInfo: VideoEventData): void {
		if (!context.get('options.tracking.kikimora.player')) {
			return;
		}

		if (!eventInfo.ad_product || !eventInfo.player || !eventInfo.event_name) {
			return;
		}

		communicationService.emit(eventsRepository.VIDEO_PLAYER_TRACKING, { eventInfo });
	},

	emitVideoEvent(videoEvent): void {
		communicationService.emit(eventsRepository.VIDEO_EVENT, { videoEvent });
	},
};
