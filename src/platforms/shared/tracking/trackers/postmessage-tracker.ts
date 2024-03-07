import { GAMOrigins, PostmessageTracker, TrackingMessage, TrackingTarget } from '@wikia/ad-engine';
import { DataWarehouseTracker } from '../data-warehouse';

export function postmessageTrackingDwTracker(dwTracker: DataWarehouseTracker): void {
	const postmessageTracker = new PostmessageTracker(['payload', 'target']);

	postmessageTracker.register<TrackingMessage>(
		async (message) => {
			const { target, payload } = message;

			switch (target) {
				case TrackingTarget.GoogleAnalytics: {
					window.ga(
						'tracker1.send',
						'event',
						payload.category,
						payload.action,
						payload.label,
						typeof payload.value === 'number' ? payload.value.toString() : payload.value,
					);
					break;
				}
				case TrackingTarget.DataWarehouse: {
					dwTracker.track(payload);
					break;
				}
				default:
					break;
			}

			return message;
		},
		[window.origin, ...GAMOrigins],
	);
}
