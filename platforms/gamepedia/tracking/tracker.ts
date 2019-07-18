import {
	Dictionary,
	eventService,
	playerEvents,
	porvataTracker,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	viewabilityPropertiesTrackingMiddleware,
	viewabilityTracker,
	viewabilityTrackingMiddleware,
} from '@wikia/ad-engine';
import { DataWarehouseTracker } from './data-warehouse';

const slotTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengadinfo';
const viewabilityUrl = 'https://beacon.wikia-services.com/__track/special/adengviewability';
const porvataUrl = 'https://beacon.wikia-services.com/__track/special/adengplayerinfo';

export const registerPorvataTracker = () => {
	const dataWarehouseTracker = new DataWarehouseTracker();

	eventService.on(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, (data) => {
		dataWarehouseTracker.track(data, porvataUrl);
	});

	porvataTracker.register();
};

export const registerSlotTracker = () => {
	const dataWarehouseTracker = new DataWarehouseTracker();

	slotTracker.onChangeStatusToTrack.push('top-conflict');

	slotTracker
		.add(slotTrackingMiddleware)
		.add(slotPropertiesTrackingMiddleware)
		.add(slotBiddersTrackingMiddleware)
		.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, slotTrackingUrl);
		});
};

export const registerViewabilityTracker = () => {
	const dataWarehouseTracker = new DataWarehouseTracker();

	viewabilityTracker
		.add(viewabilityTrackingMiddleware)
		.add(viewabilityPropertiesTrackingMiddleware)
		.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, viewabilityUrl);
		});
};
