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
	 */
	register(): void {
		const listener: PorvataEventListener = {
			/**
			 * Porvata event callback
			 */
			onEvent(eventName: string, playerParams: PorvataListenerParams, data: VideoData): void {
				const eventInfo: VideoEventData = videoEventDataProvider.getEventData(data);

				playerEventEmitter.emit(eventInfo);
			},
		};

		context.push('listeners.porvata', listener);
	}
}

export const porvataTracker = new PorvataTracker();
