import { context } from '../../../../../../core/services/context-service';
import { PorvataEventListener, PorvataListenerParams } from './porvata-listener';
import { VideoTracker } from "../../../../../../core/video/video-tracker.interface";
import { VideoData, VideoEventData } from "../../../../../../core/listeners/listeners";
import { VideoEventProvider } from "../utils/video-event-provider";

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
