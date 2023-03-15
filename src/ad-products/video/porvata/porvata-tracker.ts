import {
	context,
	VideoData,
	VideoEventData,
	VideoEventProvider,
	VideoTracker,
} from '@ad-engine/core';
import { PorvataEventListener, PorvataListenerParams } from './porvata-listener';

/**
 * Ads tracker for Porvata
 */
class PorvataTracker implements VideoTracker {
	/**
	 * Register event listeners on player
	 */
	register(): void {
		const listener: PorvataEventListener = {
			/**
			 * Porvata event callback
			 */
			onEvent(eventName: string, playerParams: PorvataListenerParams, data: VideoData): void {
				const eventInfo: VideoEventData = VideoEventProvider.getEventData(data);
				VideoEventProvider.emit(eventInfo);
			},
		};

		context.push('listeners.porvata', listener);
	}
}

export const porvataTracker = new PorvataTracker();
