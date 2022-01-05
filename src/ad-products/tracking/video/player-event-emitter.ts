import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, VideoEventData } from '@ad-engine/core';

export class PlayerEventEmitter {
	/**
	 * Emit single event
	 */
	static emit(eventInfo: VideoEventData): void {
		if (!context.get('options.tracking.kikimora.player')) {
			return;
		}

		if (!eventInfo.ad_product || !eventInfo.player || !eventInfo.event_name) {
			return;
		}

		communicationService.emit(eventsRepository.VIDEO_PLAYER_TRACKING, { eventInfo });
	}

	static emitVideoEvent(videoEvent): void {
		communicationService.emit(eventsRepository.VIDEO_EVENT, { videoEvent });
	}
}
