import {
	PostmessageTracker,
	TrackingMessage,
	trackingPayloadValidationMiddleware,
	TrackingTarget,
} from '@wikia/ad-engine';
import { DataWarehouseTracker } from './data-warehouse';

export function registerPostmessageTrackingTracker(): void {
	const postmessageTracker = new PostmessageTracker(['payload', 'target']);

	postmessageTracker
		.add(trackingPayloadValidationMiddleware)
		.register<TrackingMessage>((message) => {
			const { target, payload } = message;

			switch (target) {
				case TrackingTarget.GoogleAnalytics:
					break; // There is no tracking to Google Analytics yet
				case TrackingTarget.DataWarehouse:
					const dataWarehouseTracker = new DataWarehouseTracker();
					dataWarehouseTracker.track(payload);
					break;
				default:
					break;
			}
		});
}
