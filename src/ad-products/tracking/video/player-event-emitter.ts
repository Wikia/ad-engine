import { context, eventService } from '@wikia/ad-engine';

export const playerEvents = {
	VIDEO_PLAYER_TRACKING_EVENT: Symbol('VIDEO_PLAYER_TRACKING_EVENT'),
};

export default {
	/**
	 * Emit single event
	 * @param {object} eventInfo
	 * @returns {void}
	 */
	emit(eventInfo) {
		if (!context.get('options.tracking.kikimora.player')) {
			return;
		}

		if (!eventInfo.ad_product || !eventInfo.player || !eventInfo.event_name) {
			return;
		}

		eventService.emit(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, eventInfo);
	},
};
