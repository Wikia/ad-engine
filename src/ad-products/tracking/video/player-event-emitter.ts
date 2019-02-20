import { context, events } from '@wikia/ad-engine';

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

		events.emit(events.VIDEO_PLAYER_TRACKING_EVENT, eventInfo);
	},
};
