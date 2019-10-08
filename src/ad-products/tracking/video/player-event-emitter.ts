import { context, eventService, VideoEventData } from '@ad-engine/core';

export const playerEvents = {
	VIDEO_PLAYER_TRACKING_EVENT: Symbol('VIDEO_PLAYER_TRACKING_EVENT'),
	SLOT_CLOSE_IMMEDIATELY: 'force-close',
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

		if (eventInfo.event_name === 'force-close') {
			eventInfo.position = 'featured';
			eventService.emit(playerEvents.SLOT_CLOSE_IMMEDIATELY, eventInfo);
		} else {
			eventService.emit(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, eventInfo);
		}
	},
};
