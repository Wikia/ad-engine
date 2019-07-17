import {
	context,
	TwitchEventListener,
	TwitchListenerParams,
	VideoData,
	VideoEventData,
} from '@ad-engine/core';
import playerEventEmitter from './player-event-emitter';
import videoEventDataProvider from './video-event-data-provider';

/**
 * Ads tracker for Twitch
 */
class TwitchTracker {
	/**
	 * Register event listeners on player
	 */
	register(): void {
		const listener: TwitchEventListener = {
			/**
			 * Twitch event callback
			 */
			onEvent(eventName: string, playerParams: TwitchListenerParams, data: VideoData): void {
				const eventInfo: VideoEventData = videoEventDataProvider.getEventData(data);

				playerEventEmitter.emit(eventInfo);
			},
		};

		context.push('listeners.twitch', listener);
	}
}

export const twitchTracker = new TwitchTracker();
