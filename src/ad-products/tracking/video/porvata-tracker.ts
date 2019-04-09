import {
	context,
	PorvataEventListener,
	PorvataListenerParams,
	VideoData,
	VideoEventData,
} from '@wikia/ad-engine';
import playerEventEmitter from './player-event-emitter';
import videoEventDataProvider from './video-event-data-provider';

/**
 * Ads tracker for Porvata
 */
class PorvataTracker {
	/**
	 * Register event listeners on player
	 * @returns {void}
	 */
	register(): void {
		const listener: PorvataEventListener = {
			/**
			 * Porvata event callback
			 * @param {string} eventName
			 * @param {Object} playerParams
			 * @param {Object} data
			 * @returns {void}
			 */
			onEvent(eventName: string, playerParams: PorvataListenerParams, data: VideoData) {
				const eventInfo: VideoEventData = videoEventDataProvider.getEventData(data);

				playerEventEmitter.emit(eventInfo);
			},
		};

		context.push('listeners.porvata', listener);
	}
}

export const porvataTracker = new PorvataTracker();
