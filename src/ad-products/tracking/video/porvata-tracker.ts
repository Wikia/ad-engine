import { context, VideoData, VideoEventData } from '@ad-engine/core';
import { PorvataEventListener, PorvataListenerParams } from '../../video/porvata/porvata-listener';
import playerEventEmitter from './player-event-emitter';
import { VideoEventDataProvider } from './video-event-data-provider';

/**
 * Ads tracker for Porvata
 */
class PorvataTracker {
	/**
	 * Register event listeners on player
	 */
	register(): void {
		const listener: PorvataEventListener = {
			/**
			 * Porvata event callback
			 */
			onEvent(eventName: string, playerParams: PorvataListenerParams, data: VideoData): void {
				const eventInfo: VideoEventData = VideoEventDataProvider.getEventData(data);
				playerEventEmitter.emit(eventInfo);
			},
		};

		context.push('listeners.porvata', listener);
	}
}

export const porvataTracker = new PorvataTracker();
