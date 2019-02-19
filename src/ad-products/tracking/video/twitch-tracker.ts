import { context } from '@wikia/ad-engine';
import playerEventEmitter from './player-event-emitter';
import videoEventDataProvider from './video-event-data-provider';

/**
 * Ads tracker for Twitch
 */
export class TwitchTracker {
	/**
	 * Register event listeners on player
	 * @returns {void}
	 */
	register() {
		const listener = {
			/**
			 * Twitch event callback
			 * @param {string} eventName
			 * @param {Object} playerParams
			 * @param {Object} data
			 * @returns {void}
			 */
			onEvent(eventName, playerParams, data) {
				const eventInfo = videoEventDataProvider.getEventData(data);

				playerEventEmitter.emit(eventInfo);
			},
		};

		context.push('listeners.twitch', listener);
	}

	/**
	 * Dispatch single event
	 * @param {string} eventName
	 * @param {int} errorCode
	 * @returns {void}
	 */
	emit(eventName, errorCode = 0) {
		videoEventDataProvider.emit(eventName, errorCode);
	}
}

export const twitchTracker = new TwitchTracker();
