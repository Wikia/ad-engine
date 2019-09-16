import { context, VideoData, VideoEventData } from '@ad-engine/core';
import {
	TwitchEventListener,
	TwitchListenerParams,
} from '../../video/player/twitch/twitch-listener';
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
