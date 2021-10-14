import { context, events, eventService, VideoEventData } from '@ad-engine/core';

export const playerEvents = {
	VIDEO_PLAYER_TRACKING_EVENT: Symbol('VIDEO_PLAYER_TRACKING_EVENT'),
	PLAYER_X_CLICK: Symbol('PLAYER_X_CLICK'),
};

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

		eventService.emit(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, eventInfo);
	},

	emitVideoEvent(videoEvent): void {
		eventService.emit(events.VIDEO_EVENT, videoEvent);
	},
};
